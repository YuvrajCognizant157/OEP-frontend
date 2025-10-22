import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../core/services/auth.service';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Subscription, switchMap, timer } from 'rxjs';

Chart.register(...registerables);
Chart.defaults.color = '#FFFFFF';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.2)';
Chart.defaults.font.size = 12;

interface AnalyticsData {
  totalExamsCreated: number;
  averageScoresPerExam: {
    averageScore: number;
    examId: number;
    examTitle: string;
  }[];
  questionApprovalStats: { count: number; isApproved: boolean }[];
  studentParticipation: { examId: number; examTitle: string; studentCount: number }[];
}

@Component({
  selector: 'app-e-analytics',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './e-analytics.html',
  styleUrls: ['./e-analytics.css'],
})
export class EAnalytics implements OnInit {
  analyticsData: AnalyticsData = {
    totalExamsCreated: 0,
    averageScoresPerExam: [],
    questionApprovalStats: [],
    studentParticipation: [],
  };
  // A property to hold the subscription so we can unsubscribe later
  private analyticsSubscription!: Subscription;

  private authS = inject(AuthService);
  examinerId = this.authS.getUserRole()?.id! || 6;

  constructor(private anService: AnalyticsService) {}

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 1 } }, // Scores are likely between 0 and 1
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Average Score Per Exam' },
    },
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Average Score', backgroundColor: '#4A8AF5' }],
  };

  // --- Doughnut Chart for Question Approval ---
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Question Approval Status' },
    },
  };
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#28a745', '#ffc107'] }],
  };

  // --- Bar Chart for Student Participation ---
  public participationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Student Participation Per Exam' },
    },
  };
  public participationChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Number of Students', backgroundColor: '#56D798' }],
  };

  // Common properties
  public chartType: ChartType = 'bar';
  public chartPlugins = [DataLabelsPlugin];

  ngOnInit(): void {
    this.processAnalyticsData();
    this.analyticsSubscription = timer(0, 10000) // timer(initialDelay, period)
      .pipe(
        // Use switchMap to call the service on each timer tick
        switchMap(() => this.anService.getExaminerAnalytics(this.examinerId))
      )
      .subscribe({
        next: (data) => {
          this.analyticsData = data.value;

          this.processAnalyticsData();

          console.log('Fetched new analytics data:');
        },
        error: (err) => {
          console.error('Error fetching analytics:', err);
        },
      });
  }

  private processAnalyticsData(): void {
    // 1. Process Average Scores Data
    this.barChartData.labels = this.analyticsData.averageScoresPerExam.map((e) => e.examTitle);
    this.barChartData.datasets[0].data = this.analyticsData.averageScoresPerExam.map(
      (e) => e.averageScore
    );

    // 2. Process Question Approval Data
    this.doughnutChartData.labels = this.analyticsData.questionApprovalStats.map((s) =>
      s.isApproved ? 'Approved' : 'Pending'
    );
    this.doughnutChartData.datasets[0].data = this.analyticsData.questionApprovalStats.map(
      (s) => s.count
    );

    // 3. Process Student Participation Data
    this.participationChartData.labels = this.analyticsData.studentParticipation.map(
      (p) => p.examTitle
    );
    this.participationChartData.datasets[0].data = this.analyticsData.studentParticipation.map(
      (p) => p.studentCount
    );
  }

  ngOnDestroy(): void {
    // IMPORTANT: Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }
  }
}
