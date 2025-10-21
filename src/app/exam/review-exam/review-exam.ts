import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../core/services/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmittedExamDTO } from '../../shared/models/exam.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExamStateService } from '../../core/services/exam-state.service';

interface SubmitResponse {
  msg: string;
}

@Component({
  selector: 'app-review-exam',
  imports: [CommonModule, MatCardModule],
  templateUrl: './review-exam.html',
  styleUrl: './review-exam.css',
})
export class ReviewExam implements OnInit {
  selectedAnswers: { qid: number; Resp: string[] }[] = [];
  examId!: number;
  userId!: number;
  timeLeft!: number;

  constructor(private router: Router, private examService: ExamService,private examStateService: ExamStateService) {}

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
      setTimeout(() => {
        this.submitExam();
      }, this.timeLeft * 1000);
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
        this.examStateService.clearExamData();
        this.router.navigate(['/student/exam-feedback']);
        // show message if available, otherwise stringify the whole response
        alert((res as SubmitResponse)?.msg ?? JSON.stringify(res));
      },
      error: (err) => {
        console.log(err?.error?.errors);
        console.error('Submit failed', err);
      },
    });
  }
}
