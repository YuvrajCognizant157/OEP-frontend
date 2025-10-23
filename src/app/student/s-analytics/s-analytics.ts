import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
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
import { ResultService } from '../../core/services/result.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-s-analytics',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './s-analytics.html',
  styleUrl: './s-analytics.css'
})
export class SAnalytics implements OnInit {

  constructor(private analyticsService: AnalyticsService,
    private authService: AuthService, @Inject(ResultService) private resultService: ResultService
  ) { }

  userId!: number;

  isLoadingResults = true;

  allExamResults: any[] = [];
  availableExams: { eid: number, examName: string }[] = [];
  selectedExamId!: number;


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

    this.resultService.viewResultsByUserId(this.userId).subscribe({
      next: (results: any[]) => {
        this.allExamResults = results.filter(e => e.attemptsData && e.attemptsData.length > 0);
        this.availableExams = this.allExamResults.map(exam => ({
          eid: exam.eid,
          examName: exam.examName
        }));

        // Select the first exam with data by default
        if (this.availableExams.length > 0) {
          this.selectedExamId = this.availableExams[0].eid;
          this.loadLineChartData(this.selectedExamId);
        }
        this.isLoadingResults = false;
      },
      error: (err) => {
        console.error('Error loading exam results', err);
        this.isLoadingResults = false;
      }
    });
  }


  onExamSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newId = +target.value; // Convert string value to number
    this.selectedExamId = newId;
    this.loadLineChartData(newId);
  }

  loadLineChartData(examId: number): void {
    const exam = this.allExamResults.find(e => e.eid === examId);
    if (!exam || exam.attemptsData.length === 0) {
      this.lineChartData = { labels: ['N/A'], datasets: [{ data: [0], label: 'Score (%)' }] };
      // Update chart options title
      if (this.lineChartOptions?.plugins?.title) {
        (this.lineChartOptions.plugins.title as any).text = 'No Attempts Recorded';
      }
      return;
    }

    // Map attempt number to label
    const labels = exam.attemptsData.map((a: any) => `Attempt ${a.attempt}`);

    // Calculate score percentage
    const scores = exam.attemptsData.map((a: any) =>
      ((a.score / exam.totalMarks) * 100)
    );

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: scores,
          label: 'Score (%)',
          borderColor: '#099bc7',
          backgroundColor: 'rgba(9, 155, 199, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 6, // Make points stand out
          pointBackgroundColor: '#099bc7',
          pointBorderColor: '#fff',
        }
      ]
    };

    // Update chart title with the selected exam name
    if (this.lineChartOptions?.plugins?.title) {
      (this.lineChartOptions.plugins.title as any).text = `${exam.examName}: Score Progression`;
    }
  }


  // ---- Line Chart Configuration Update ----
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Removed legend as only one line exists
      title: { display: true, text: 'Score Progression by Exam' } // Initial Title
    },
    scales: {
      y: { beginAtZero: true, max: 100 } // Set max to 100 for percentage
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['Attempt 1', 'Attempt 2', 'Attempt 3'],
    datasets: [
      {
        data: [0, 0, 0], // Initial placeholder data
        label: 'Score (%)',
        borderColor: '#099bc7',
        backgroundColor: 'rgba(9, 155, 199, 0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  };




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
  // public lineChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: { display: true },
  //     title: { display: true, text: 'Weekly Progress Trend' }
  //   },
  //   scales: {
  //     y: { beginAtZero: true }
  //   }
  // };
  // public lineChartType: ChartType = 'line';
  // public lineChartData: ChartData<'line'> = {
  //   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  //   datasets: [
  //     {
  //       data: [60, 72, 85, 90],
  //       label: 'Progress (%)',
  //       borderColor: '#46ccd5',
  //       backgroundColor: 'rgba(70, 204, 213, 0.3)',
  //       fill: true,
  //       tension: 0.4
  //     }
  //   ]
  // };
}
