
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../core/services/feedback.service';
import { GetQuestionFeedback } from './question-feedback.model';


@Component({
  selector: 'app-question-feedback',
  imports: [],
  templateUrl: './question-feedback.html',
  styleUrl: './question-feedback.css'
})
export class QuestionFeedback implements OnInit {
  userId = 5; // Replace with actual logged-in user ID
  feedbacks: GetQuestionFeedback[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe({
      next: (data) => this.feedbacks = data,
      error: (err) => console.error('Failed to load feedbacks', err)
    });
  }
}

