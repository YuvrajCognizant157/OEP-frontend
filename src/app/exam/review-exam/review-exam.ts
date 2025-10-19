import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../core/services/exam.service';
import { ActivatedRoute,Router } from '@angular/router';
import { SubmittedExamDTO } from '../../shared/models/exam.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";

interface SubmitResponse {
  msg:string;
}

@Component({
  selector: 'app-review-exam',
  imports: [CommonModule, MatCardModule],
  templateUrl: './review-exam.html',
  styleUrl: './review-exam.css'
})

export class ReviewExam implements OnInit {
  selectedAnswers: { qid: number; Resp: string[] }[] = [];
  examId!: number;
  userId!: number;

  constructor(private router: Router,private examService: ExamService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    this.selectedAnswers = state?.selectedAnswers || [];
    this.examId = state?.examId;
    this.userId = state?.userId;
  }
  ngOnInit(): void {
    // You can perform any initialization logic here if needed.
    // For example, you might want to validate that examId and userId are present.
    if (!this.examId || !this.userId) {
      console.warn('Missing examId or userId in navigation state.');
    }
  }

  submitExam() {

  const payload: SubmittedExamDTO = {
    EID: this.examId,
    UserId: this.userId,
    Responses: this.selectedAnswers
  };

    this.examService.submitExam(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['/student/exam-feedback']);
        // show message if available, otherwise stringify the whole response
        alert((res as SubmitResponse)?.msg ?? JSON.stringify(res));
      },
      error: err => {console.log(err?.error?.errors);console.error('Submit failed', err);}
    });
  }

}
