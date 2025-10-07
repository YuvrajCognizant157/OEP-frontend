import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { optionDisplayType, StartExamResponseDTO,ReceivedResponseDTO } from '../../shared/models/exam.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-exam',
  imports: [CommonModule],
  templateUrl: './start-exam.html',
  styleUrl: './start-exam.css',
})
export class StartExam implements OnInit {
  examId!: number;
  userId = 5; // Replace with actual logged-in user ID
  examData!: StartExamResponseDTO;
  backendError = false;
  timeLeft!: number;
  timerInterval: any;
  examStarted = false;
  timeUp = false;

  DisplayOptions: optionDisplayType[] = [];
  selectedAnswers: { qid: number; Resp: string[] }[] = [];

  constructor(private route: ActivatedRoute,private router: Router, private examService: ExamService) {}

  ngOnInit(): void {
    this.examId = 7;
    this.startExam();
  }

  startExam() {
    this.examService.startExam(this.examId, this.userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res);

          if (res.examData.questions) {
            for (let q of res.examData.questions) {
              const parsedOptions = JSON.parse(q.options);

              const displayOptions: optionDisplayType[] = Object.entries(parsedOptions).map(
                ([key, value]) => ({
                  id: Number(key),
                  value: value as string,
                })
              );

              q.options = displayOptions; 
            }
          }

          this.examData = res.examData;

          this.timeLeft = res.examData.duration * 60;
          this.startTimer();
          this.examStarted = true;
        } else {
          alert('Exam not available or attempt limit reached.');
        }
      },
      error: (err) => {
        this.backendError=true;
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

  onOptionSelected(qid: number, selectedOptionId: number) {
    const index = this.selectedAnswers.findIndex(a => a.qid === qid);
    if (index !== -1) {
      this.selectedAnswers[index].Resp.push( String(selectedOptionId));
    } else {
      var selectedAns:ReceivedResponseDTO = {qid:qid,Resp:[String(selectedOptionId)]};
      this.selectedAnswers.push(selectedAns);
    }
  }

  onFinishExam() {
    this.router.navigate(['/exam/review-exam'], {
      state: {
        selectedAnswers: this.selectedAnswers,
        examId: this.examData.eid,
        userId: this.userId
      }
    });
  }
}
