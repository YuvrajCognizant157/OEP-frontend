import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import {
  optionDisplayType,
  StartExamResponseDTO,
  StartExamQuestionDTO,
} from '../../shared/models/exam.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FeedbackService, AddQuestionFeedbackDTO } from '../../core/services/feedback.service';
import { ExamStateService } from '../../core/services/exam-state.service';
import { LayoutService } from '../../core/services/layout.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-start-exam',
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule
],
  templateUrl: './start-exam.html',
  styleUrl: './start-exam.css',
})
export class StartExam implements OnInit, OnDestroy {
  private authS = inject(AuthService);
  private layoutService = inject(LayoutService);

  examId!: number;
  userId = this.authS.getUserRole()?.id! || 5;
  examData!: StartExamResponseDTO;
  backendError = false;
  timeLeft!: number;
  timerInterval: any;
  examStarted = false;
  timeUp = false;

  currentIndex = 0;
  currentQuestion!: StartExamQuestionDTO;

  DisplayOptions: optionDisplayType[] = [];
  selectedAnswers: { qid: number; name: string; Resp: string[] }[] = [];

  isReportModalVisible: boolean = false;
  questionFeedback: string = '';
  feedbackSubmitted: boolean = false;

  isPanelCollapsed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private feedbackService: FeedbackService,
    private examStateService: ExamStateService
  ) {}

  ngOnInit(): void {
    this.layoutService.hideLayout();
    document.documentElement.requestFullscreen();
    this.examId = Number(this.route.snapshot.paramMap.get('examId')) || 7;
    this.startExam();
  }

  openReportModal(): void {
    this.isReportModalVisible = true;
  }

  closeReportModal(): void {
    this.isReportModalVisible = false;
    this.questionFeedback = ''; // Reset feedback text on close
    this.feedbackSubmitted = false; // Reset submission status
  }

  // *** NEW METHOD ***
  // Goes to the previous question
  onPrevious(): void {
    // Only go back if we are not on the first question
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentQuestion = this.examData.questions[this.currentIndex];
    }
  }

  markAndNext() {
    this.closeReportModal(); // Ensure modal is closed when moving to next question
    // Check if there are more questions left
    if (this.currentIndex < this.examData.questions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = this.examData.questions[this.currentIndex];
    } else {
      // This is the last question, so finish the exam
      this.timeUp = true;
      clearInterval(this.timerInterval);
      this.onFinishExam();
    }
  }

  submitQuestionReport() {
    if (!this.currentQuestion) return;
    const payload: AddQuestionFeedbackDTO = {
      feedback: this.questionFeedback,
      qid: this.currentQuestion.qid,
      studentId: this.userId,
    };

    this.feedbackService.addQuestionFeedback(payload).subscribe({
      next: () => {
        this.feedbackSubmitted = true;
        // Close the modal after a short delay to show the success message
        setTimeout(() => {
          this.closeReportModal();
        }, 2000);
      },
      error: (err) => {
        console.error('Error submitting question report:', err);
        alert('Could not submit your report. Please try again.');
      },
    });
  }

  startExam() {
    this.examService.startExam(this.examId, this.userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.examData.questions) {
            for (let q of res.examData.questions) {
              const parsedOptions = JSON.parse(q.options);

              const displayOptions: optionDisplayType[] = Object.entries(parsedOptions).map(
                ([key, value]) => ({
                  id: Number(key),
                  value: value as string,
                })
              );
              q.ParsedOptions = displayOptions;
              q.options = displayOptions;
            }
          }

          this.examData = res.examData;
          // Set the first question
          this.currentQuestion = this.examData.questions[this.currentIndex]; // Was [0]
          this.timeLeft = res.examData.duration * 60;
          this.startTimer();
          this.examStarted = true;
        } else {
          alert('Exam not available or attempt limit reached.');
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        this.backendError = true;
        console.error('Error starting exam:', err);
        alert('Internal error occurred.');
      },
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeUp = true;
        clearInterval(this.timerInterval);
        this.onFinishExam();
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  getSelectedRadioValue(qid: number): number | null {
    const answer = this.selectedAnswers.find((a) => a.qid === qid);
    if (answer && answer.Resp.length > 0) {
      // Return the first (and only) selected answer as a number
      return Number(answer.Resp[0]);
    }
    return null; // No selection
  }

  onOptionSelected(qid: number, questionName: string, selectedOptionId: number) {
    const index = this.selectedAnswers.findIndex((a) => a.qid === qid);
    if (index !== -1) {
      this.selectedAnswers[index].Resp = [String(selectedOptionId)];
    } else {
      this.selectedAnswers.push({ qid, name: questionName, Resp: [String(selectedOptionId)] });
    }
  }

  onFinishExam() {
    const allQuestionIds = this.examData.questions.map((q: any) => q.qid);

    const answeredQids = this.selectedAnswers.map((a) => a.qid);
    const unansweredQids = allQuestionIds.filter((qid) => !answeredQids.includes(qid));

    unansweredQids.forEach((qid) => {
      this.selectedAnswers.push({ qid, name: '', Resp: [] });
    });

    this.examStateService.setExamData({
      selectedAnswers: this.selectedAnswers,
      examId: this.examData.eid,
      userId: this.userId,
      timeLeft: this.timeLeft,
    });
    this.layoutService.hideLayout();

    document.exitFullscreen();
    this.router.navigate(['/student/review-exam']);
  }

  isOptionSelected(qid: number, optionId: number): boolean {
    const answer = this.selectedAnswers.find((a) => a.qid === qid);
    return answer ? answer.Resp.includes(String(optionId)) : false;
  }

  onOptionToggled(qid: number, questionName: string, optionId: number, checked: boolean) {
    const answer = this.selectedAnswers.find((a) => a.qid === qid);
    if (answer) {
      if (checked) {
        if (!answer.Resp.includes(String(optionId))) {
          answer.Resp.push(String(optionId));
        }
      } else {
        answer.Resp = answer.Resp.filter((id) => id !== String(optionId));
      }
    } else {
      this.selectedAnswers.push({ qid, name: questionName, Resp: [String(optionId)] });
    }
  }

  // Toggle sidebar open/close
  togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }

  // Navigate to a specific question
  goToQuestion(index: number): void {
    this.currentIndex = index;
    this.currentQuestion = this.examData.questions[this.currentIndex];
  }

  // Helper to check if a question is answered
  isQuestionAnswered(qid: number): boolean {
    return this.selectedAnswers.some((a) => a.qid === qid && a.Resp.length > 0);
  }

  get answeredCount(): number {
  return this.selectedAnswers.filter(a => a.Resp && a.Resp.length > 0).length;
}

get unansweredCount(): number {
  return this.examData?.questions?.length - this.answeredCount;
}

  ngOnDestroy(): void {
    if (this.timerInterval && this.timeLeft) {
      clearInterval(this.timerInterval);
    }
    this.layoutService.showLayout();
    // Also good practice to exit fullscreen if component is destroyed
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}
