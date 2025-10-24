import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ExamStateService } from '../../core/services/exam-state.service';
import { ExamService } from '../../core/services/exam.service';
import { SubmittedExamDTO } from '../../shared/models/exam.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';


interface SubmitResponse {
  msg: string;
}

@Component({
  selector: 'app-review-exam',
  imports: [CommonModule, MatCardModule],
  templateUrl: './review-exam.html',
  styleUrl: './review-exam.css',
})
export class ReviewExam implements OnInit, OnDestroy {
  private autoSubmitTimer: any;

  selectedAnswers: { qid: number; name: string; Resp: string[] }[] = [];
  examId!: number;
  userId!: number;
  timeLeft: number = 0;

  constructor(
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService
  ) {}

  ngOnInit(): void {
    const data = this.examStateService.examData();

    if (!data) {
      console.warn('Missing exam data');
      return;
    }

    this.selectedAnswers = data.selectedAnswers;
    this.examId = data.examId;
    this.userId = data.userId;
    this.timeLeft = data.timeLeft;

    if (this.timeLeft > 0) {
      this.autoSubmitTimer = setTimeout(() => {
        this.submitExam();
      }, this.timeLeft * 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.autoSubmitTimer) {
      clearTimeout(this.autoSubmitTimer);
      this.autoSubmitTimer = null;
    }
  }

  submitExam() {
    const payload: SubmittedExamDTO = {
      EID: this.examId,
      UserId: this.userId,
      Responses: this.selectedAnswers,
    };

    this.examService.submitExam(payload).subscribe({
      next: (res: any) => {
        this.timeLeft = 0;
        this.examStateService.clearExamData();
        alert((res as SubmitResponse)?.msg ?? JSON.stringify(res));
        this.router.navigate([`/student/exam-feedback/${this.examId}`]);
      },
      error: (err) => {
        console.error('Submit failed', err);
      },
    });
  }
}