import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-s-analytics',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './s-analytics.html',
  styleUrl: './s-analytics.css'
})
export class SAnalytics implements OnInit {

  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  userId!: number; 


  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    this.analyticsService.getStudentAnalytics(this.userId).subscribe({
      next: (res) => {
        const data = res.value;
        if (!data) return;

        // ---- BAR: Average Score per Exam ----
        const exams = data.averageScoreMultipleAttempts;
        this.barChartData = {
          labels: exams.map((e: any) => e.examTitle),
          datasets: [
            {
              label: 'Average Score (%)',
              data: exams.map((e: any) => e.averageScore),
              backgroundColor: '#46ccd5'
            }
          ]
        };


        // ---- PIE: Average Score per Topic ----
        const topics = data.overallAverageScoreTopicWise;
        this.pieChartData = {
          labels: topics.map((t: any) => t.topic),
          datasets: [
            {
              data: topics.map((t: any) => t.averageScore),
              backgroundColor: ['#46ccd5', '#5e60ce', '#48bfe3', '#64dfdf']
            }
          ]
        };

        // ---- DOUGHNUT: Attempts Distribution ----
        const attempts = data.examAttemptsRecords;
        this.doughnutChartData = {
          labels: ['Single Attempts', 'Double Attempts', 'Triple Attempts'],
          datasets: [
            {
              data: [
                attempts.singleAttempts,
                attempts.doubleAttempts,
                attempts.trippleAttempts
              ],
              backgroundColor: ['#5e60ce', '#46ccd5', '#48bfe3']
            }
          ]
        };
      },
      error: (err) => console.error('Error loading analytics', err)
    });
  }



  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Performance by Subject' }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Math', 'Science', 'English', 'History', 'CS'],
    datasets: [
      { data: [85, 92, 78, 88, 95], label: 'Score (%)', backgroundColor: '#46ccd5' }
    ]
  };

  // ---- Pie Chart ----
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Analysis by topic' }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Reading', 'Practice', 'Tests', 'Break'],
    datasets: [{
      data: [30, 40, 20, 10],
      backgroundColor: ['#46ccd5', '#5e60ce', '#48bfe3', '#64dfdf']
    }]
  };
  public pieChartType: ChartType = 'pie';

  // ---- Doughnut Chart ----
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Attempts Distribution' }
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['MCQs', 'Descriptive', 'Coding', 'Projects'],
    datasets: [{
      data: [78, 85, 90, 95],
      backgroundColor: ['#5e60ce', '#46ccd5', '#48bfe3', '#64dfdf']
    }]
  };

  // ---- Line Chart ----
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Weekly Progress Trend' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [60, 72, 85, 90],
        label: 'Progress (%)',
        borderColor: '#46ccd5',
        backgroundColor: 'rgba(70, 204, 213, 0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  };
}
