import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion'; // Used for the FAQ accordion
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatExpansionModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDividerModule,
    RouterModule // For routerLink
  ],
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class HelpComponent {
  // Data structure for the FAQ (Frequently Asked Questions)
  faqs = [
    {
      category: 'General Account & Access',
      questions: [
        {
          q: 'How do I recover my password?',
          a: "Click 'Forgot Password' on the sign-in page. You'll need to enter your registered email address to receive a password reset link."
        },
        {
          q: 'Do I need a separate account for different roles (Student/Examiner)?',
          a: 'No. Your role is assigned by the administrator upon registration. You can access different dashboards based on your authenticated role.'
        },
      ]
    },
    {
      category: 'For Students: Taking an Exam',
      questions: [
        {
          q: 'What equipment do I need to take an exam?',
          a: 'You need a reliable computer (desktop/laptop), a modern web browser (Chrome, Firefox, Edge), a stable internet connection, and optionally, a webcam/microphone if proctoring is enabled.'
        },
        {
          q: 'Can I pause an exam?',
          a: "No, once an exam begins, the timer is continuous. If you lose connection, your progress is saved, but the timer will continue to run."
        },
      ]
    },
    {
      category: 'For Examiners: Creating Content',
      questions: [
        {
          q: 'How do I add questions to the Question Bank?',
          a: "Navigate to the 'Manage Questions' section. You can manually add single questions or use the bulk upload feature with a CSV template."
        },
        {
          q: 'What types of questions are supported?',
          a: 'We support Multiple Choice (Single/Multi-select), True/False, Fill-in-the-Blank, and Subjective (long answer) questions.'
        },
      ]
    }
  ];
}