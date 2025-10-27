import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common'; // SlicePipe added for template
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Added for loading spinner
import { RouterModule } from '@angular/router';
import { FeedbackService } from '../../core/services/feedback.service'; // Adjust path
import { HttpClientModule } from '@angular/common/http';
import { ExamFeedback } from '../../shared/models/exam-feedback.model'; // 1. Define the Interfaces (or import them)
import { QuestionFeedback } from '../../shared/models/question-review.model';
import { AuthService } from '../../core/services/auth.service';
// 1. Define the Interfaces (or import them)


@Component({
  selector: 'app-s-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule,
    MatProgressSpinnerModule // Added for loading spinner
  ],
  templateUrl: './s-feedback.html',
  styleUrl: './s-feedback.css'
})
export class SFeedback implements OnInit {

  private feedbackService = inject(FeedbackService);
  private authS = inject(AuthService);
  private readonly userId = this.authS.getUserId()!;

  // Data Signals
  examFeedbacks = signal<ExamFeedback[]>([]);
  questionFeedbacks = signal<QuestionFeedback[]>([]);
  
  // Loading Signals
  isLoadingExams = signal(true);
  isLoadingQuestions = signal(true);
  
  // 🔑 UPDATED: Removed 'actions' column
  examDisplayedColumns: string[] = ['eid', 'examName', 'feedbackText'];
  questionDisplayedColumns: string[] = ['qId', 'feedback'];

  ngOnInit(): void {
    this.loadExamFeedbacks();
    this.loadQuestionFeedbacks();
  }

  loadExamFeedbacks(): void {
    this.isLoadingExams.set(true);
    this.feedbackService.getAllExamFeedbacksByUserId(this.userId).subscribe({
      next: (data) => {
        this.examFeedbacks.set(data);
        this.isLoadingExams.set(false);
      },
      error: (err) => {
        console.error('Failed to load exam feedbacks:', err);
        this.isLoadingExams.set(false);
      }
    });
  }

  loadQuestionFeedbacks(): void {
    this.isLoadingQuestions.set(true);
    this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe({
      next: (data) => {
        this.questionFeedbacks.set(data);
        this.isLoadingQuestions.set(false);
      },
      error: (err) => {
        console.error('Failed to load question feedbacks:', err);
        this.isLoadingQuestions.set(false);
      }
    });
  }
}