import { Component, OnInit } from '@angular/core';
import { ExaminerService } from '../../core/services/examiner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-e-analytics',
  imports: [CommonModule],
  templateUrl: './e-analytics.html',
  styleUrl: './e-analytics.css'
})
export class EAnalytics implements OnInit {
  analyticsData: any;
  examinerId = 1; // Get this from a logged-in user's session or authentication service

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    this.examinerService.getExaminerAnalytics(this.examinerId).subscribe({
      next: (data) => {this.analyticsData = data},
      error:(err) => {
        console.error('Error fetching analytics:', err);
      }
    });
  }
}