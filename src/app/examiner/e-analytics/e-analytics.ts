import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-e-analytics',
  imports: [CommonModule],
  templateUrl: './e-analytics.html',
  styleUrl: './e-analytics.css',
})
export class EAnalytics implements OnInit {
  analyticsData: {
    totalExamsCreated: number;
    averageScoresPerExam: {
      averageScore: number;
      examId: number;
      examTitle: string;
    }[];
    questionApprovalStats: { count: number; isApproved: boolean }[];
    studentParticipation: { examId: number; examTitle: string; studentCount: number }[];
  } = {
    totalExamsCreated: 0,
    averageScoresPerExam: [],
    questionApprovalStats: [],
    studentParticipation: [],
  };
  examinerId = 1;

  constructor(private anService: AnalyticsService) {}

  ngOnInit(): void {
    this.anService.getExaminerAnalytics(this.examinerId).subscribe({
      next: (data) => {
        this.analyticsData = data.value;
        console.log(this.analyticsData);
      },
      error: (err) => {
        console.error('Error fetching analytics:', err);
      },
    });
  }
}
