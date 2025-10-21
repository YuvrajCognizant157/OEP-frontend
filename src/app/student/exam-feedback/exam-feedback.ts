import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ExamService } from '../../core/services/exam.service';


@Component({
  selector: 'app-exam-feedback',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatInputModule],
  templateUrl: './exam-feedback.html',
  styleUrl: './exam-feedback.css'
})
export class ExamFeedback implements OnInit {
  
examId!: number;
  userId!: number; // You can fetch this from auth or state
  feedbackControl = new FormControl('');

  constructor(private route: ActivatedRoute, private router: Router, private examService: ExamService) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    // Replace with actual user ID logic
    this.userId = Number(localStorage.getItem("userId"));
  }

  submitFeedback(skip: boolean = false): void {
    const feedbackText = skip ? 'No feedback added.' : this.feedbackControl.value ?? '';

    const payload = {
      Feedback: feedbackText,
      Userid: this.userId,
    };

    this.examService.submitExamFeedback(this.examId, payload).subscribe({
      next: (res) => {
        if(res.success){
          alert('Feedback submitted successfully.');
          this.router.navigate(['/student/dashboard']);
        }
        else{
          alert('Feedback could not be added with this examId');
        }
        
      },
      error: (err) => {
        console.error('Feedback submission failed', err);
      },
    });
  }

}
