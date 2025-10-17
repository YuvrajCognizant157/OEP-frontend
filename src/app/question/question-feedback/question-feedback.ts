
import { Component, OnInit, signal } from '@angular/core';
import { FeedbackService } from '../../core/services/feedback.service';
import { GetQuestionFeedback } from './question-feedback.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-question-feedback',
  imports: [MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './question-feedback.html',
  styleUrl: './question-feedback.css'
})
export class QuestionFeedback implements OnInit {
  userId = -1; 
  feedbacks: GetQuestionFeedback[] = [];

  isLoading = signal<boolean>(false);

  constructor(private feedbackService: FeedbackService,private authS : AuthService) {}

  ngOnInit(): void {
    this.userId = this.authS.getUserRole()?.id!;
    this.isLoading.set(true);
    this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe({
      next: (data: GetQuestionFeedback[]) => { this.feedbacks = data; this.isLoading.set(false); },
      error: (err) => { console.error('Failed to load feedbacks', err); this.isLoading.set(false); }
    });
  }
}
