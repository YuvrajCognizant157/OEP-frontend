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
import { TopicWiseQuestionCount } from '../../shared/models/s-analytics.model';

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

    this.analyticsService.getTopicWiseQuestionCount(this.userId).subscribe({
      next: (res:  TopicWiseQuestionCount[] ) => {
        console.log('Topic Wise Question Count Response:', res);

        let topicsQ = res;
        if (!topicsQ || topicsQ.length === 0) return;

        console.log('TopicsQ-Data: ',topicsQ);
        
        // Use a color array for variety/colorfulness
        const colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4D5360'
        ];

        this.topicLineChartData = {
          labels: topicsQ.map(t => t.topicName),
          datasets: [
            {
              label: 'Questions Attempted',
              data: topicsQ.map(t => t.questionsAttempted),
              fill: true, 
              tension: 0.2,
              borderColor: '#5e60ce',
              backgroundColor: 'rgba(94, 96, 206, 0.2)',
              pointBackgroundColor: colors,
              pointBorderColor: '#fff',
              pointRadius: 5,
            }
          ]
        };
        console.log('Chart-Data: ',this.topicLineChartData);
      },
      error: (err) => console.error('Error loading topic analytics', err)
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

  // New Line Chart for Topic Wise Questions
  public topicLineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Questions Attempted Per Topic' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Questions Attempted' }
      }
    }
  };
  public topicLineChartType: ChartType = 'line';
  public topicLineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Questions Attempted',
        fill: false,
        tension: 0.2,
        pointRadius: 5,
        pointHitRadius: 10,
      }
    ]
  };

  // Helper getter for the new chart data
  get hasTopicLineData(): boolean {
    const labelCount = this.topicLineChartData.labels?.length ?? 0;
    return labelCount > 1 && this.getTotalFromChartData(this.topicLineChartData) > 0;
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



  // student-analytics.ts or student-dashboard.ts

  // ...

  get hasBarData(): boolean {
    // Safely compute total sum of numeric values in barChartData datasets
    return this.getTotalFromChartData(this.barChartData) > 0;
  }

  get hasPieData(): boolean {
    // Safely compute total sum of numeric values in pieChartData datasets
    return this.getTotalFromChartData(this.pieChartData) > 0;
  }

  get hasDoughnutData(): boolean {
    // Safely compute total sum of numeric values in doughnutChartData datasets
    return this.getTotalFromChartData(this.doughnutChartData) > 0;
  }

  get hasLineData(): boolean {
    // Return true if there are available exams (line chart driven by exam attempts)
    return this.availableExams.length > 0;
  }

  /**
   * Helper to safely extract numeric total from ChartData datasets.
   * Handles numbers, numeric arrays (e.g. [x,y]), and point objects with a numeric 'y' property.
   */
  private getTotalFromChartData(chartData?: any): number {
    if (!chartData || !Array.isArray(chartData.datasets) || chartData.datasets.length === 0) {
      return 0;
    }

    let total = 0;
    for (const ds of chartData.datasets) {
      const data = ds?.data;
      if (!Array.isArray(data)) continue;

      for (const item of data) {
        if (typeof item === 'number') {
          total += item;
        } else if (Array.isArray(item)) {
          // e.g. [x, y] pairs - sum numeric elements
          for (const v of item) {
            if (typeof v === 'number') total += v;
          }
        } else if (item && typeof item === 'object') {
          // chart point objects like {x:..., y:...}
          if (typeof item.y === 'number') total += item.y;
          else if (typeof item.value === 'number') total += item.value;
        }
      }
    }

    return total;
  }

  // ...

}
