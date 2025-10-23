import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../core/services/auth.service';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables,Point } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Subscription, switchMap, timer } from 'rxjs';
import 'chartjs-adapter-date-fns'; // Import date adapter
import 'chart.js/auto'; 

Chart.register(...registerables);
Chart.defaults.color = '#FFFFFF';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.2)';
Chart.defaults.font.size = 12;

interface ScatterPoint extends Point {
  examTitle: string;
}

interface AnalyticsData {
  totalExamsCreated: number;
  averageScoresPerExam: {
    averageScore: number;
    examId: number;
    examTitle: string;
  }[];
  questionApprovalStats: { count: number; isApproved: boolean }[];
  studentParticipation: { examId: number; examTitle: string; studentCount: number }[];
  topicApprovalStats: {
    topicId: number;
    subject: string;
    isApproved: boolean;
    count: number;
  }[];
  avgTopicScores: {
    topicId: number;
    subject: string;
    averageScore: number;
  }[];
  topicQuestionCounts: {
    topicId: number;
    subject: string;
    questionCount: number;
  }[];

  // New properties based on our discussion
  questionTypeDistribution: { type: string; count: number }[];
  submissionsOverTime: { date: string; submissionCount: number }[]; // Date will be a string
  hardestQuestions: { questionId: number; questionText: string; averageScore: number }[];
  easiestQuestions: { questionId: number; questionText: string; averageScore: number }[];
  examPerformanceCorrelation: {
    examId: number;
    examTitle: string;
    averageScore: number;
    studentCount: number;
  }[];
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
    topicApprovalStats: [],
    avgTopicScores: [],
    topicQuestionCounts: [],
    // New properties
    questionTypeDistribution: [],
    submissionsOverTime: [],
    hardestQuestions: [],
    easiestQuestions: [],
    examPerformanceCorrelation: [],
  };
  // A property to hold the subscription so we can unsubscribe later
  private analyticsSubscription!: Subscription;

  private authS = inject(AuthService);
  examinerId = this.authS.getUserRole()?.id! || 6;

  constructor(private anService: AnalyticsService) {}

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 100 } }, // Scores are likely between 0 and 1
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
    datasets: [{ data: [], backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }],
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

   public topicQuestionCountsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Question Count on Topics' },
    },
  };
  public topicQuestionCountsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Number of Questions', backgroundColor: '#d756b5ff' }],
  };

  public AvgTopicScoresChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Average of Topic Scores' },
    },
  };
  public AvgTopicScoresChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Average Score', backgroundColor: '#d7565aff' }],
  };


  public questionTypeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Question Type Distribution' },
    },
  };
  public questionTypeChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14'] }],
  };

  // --- New Chart: Submissions Over Time (Line) ---
  public submissionsTimeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'MMM dd, yyyy' },
        title: { display: true, text: 'Date' },
      },
      y: { beginAtZero: true, title: { display: true, text: 'Submissions' } },
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Student Submissions Over Time' },
    },
  };
  public submissionsTimeChartData: ChartData<'line'> = {
    labels: [], // Dates will go here
    datasets: [{ data: [], label: 'Submissions', backgroundColor: '#17a2b8', borderColor: '#17a2b8', fill: 'origin' }],
  };

  // --- New Chart: Hardest Questions (Horizontal Bar) ---
  public hardestQuestionsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y', // Makes it a horizontal bar chart
    scales: { x: { beginAtZero: true, max: 100 } }, // Assuming scores 0-100
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top 5 Hardest Questions (Lowest Avg. Score)' },
    },
  };
  public hardestQuestionsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Average Score', backgroundColor: '#dc3545' }],
  };

  // --- New Chart: Easiest Questions (Horizontal Bar) ---
  public easiestQuestionsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y', // Makes it a horizontal bar chart
    scales: { x: { beginAtZero: true, max: 100 } }, // Assuming scores 0-100
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top 5 Easiest Questions (Highest Avg. Score)' },
    },
  };
  public easiestQuestionsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Average Score', backgroundColor: '#28a745' }],
  };

  // --- New Chart: Performance vs. Participation (Scatter) ---
  public correlationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Number of Students' } },
      y: { title: { display: true, text: 'Average Score (%)' }, max: 100 },
    },
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Exam Performance vs. Participation' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as ScatterPoint;
            return `${point.examTitle}: (${context.parsed.x} students, ${context.parsed.y}% avg)`;
          },
        },
      },
    },
  };
  public correlationChartData: ChartData<'scatter'> = {
    datasets: [
      {
        data: [], // Data will be { x, y, examTitle } objects
        label: 'Exam',
        backgroundColor: '#ffc107',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Common properties
  public chartType: ChartType = 'bar';
  public chartPlugins = [DataLabelsPlugin];

  ngOnInit(): void {
    this.processAnalyticsData();
    this.analyticsSubscription = timer(0, 30000) // timer(initialDelay, period)
      .pipe(
        // Use switchMap to call the service on each timer tick
        switchMap(() => this.anService.getExaminerAnalytics(this.examinerId))
      )
      .subscribe({
        next: (data) => {
          this.analyticsData = data.value;

          this.processAnalyticsData();

          console.log('Fetched new analytics data:',this.analyticsData);
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

    //4. Topic Avg Scores
    this.AvgTopicScoresChartData.labels = this.analyticsData.avgTopicScores.map(
      (p) => p.subject
    );
    this.AvgTopicScoresChartData.datasets[0].data = this.analyticsData.avgTopicScores.map(
      (p) => p.averageScore
    )

    //5. Topic Questions Count
    this.topicQuestionCountsChartData.labels  = this.analyticsData.topicQuestionCounts.map(
      (p) => p.subject
    )
    this.topicQuestionCountsChartData.datasets[0].data  = this.analyticsData.topicQuestionCounts.map(
      (p) => p.questionCount
    )

    if (this.analyticsData.questionTypeDistribution) {
      this.questionTypeChartData = {
        labels: this.analyticsData.questionTypeDistribution.map((q) => q.type),
        datasets: [{
          data: this.analyticsData.questionTypeDistribution.map((q) => q.count),
          backgroundColor: ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'],
        }],
      };
    }

    // 7. Submissions Over Time
    if (this.analyticsData.submissionsOverTime) {
      this.submissionsTimeChartData = {
        labels: this.analyticsData.submissionsOverTime.map((s) => s.date), // Already strings
        datasets: [{
          data: this.analyticsData.submissionsOverTime.map((s) => s.submissionCount),
          label: 'Submissions',
          backgroundColor: 'rgba(23, 162, 184, 0.5)',
          borderColor: '#17a2b8',
          fill: 'origin',
          tension: 0.3
        }],
      };
    }

    // 8. Hardest Questions
    if (this.analyticsData.hardestQuestions) {
      this.hardestQuestionsChartData = {
        labels: this.analyticsData.hardestQuestions.map((q) => q.questionText),
        datasets: [{
          data: this.analyticsData.hardestQuestions.map((q) => q.averageScore),
          label: 'Average Score',
          backgroundColor: '#dc3545',
        }],
      };
    }

    // 9. Easiest Questions
    if (this.analyticsData.easiestQuestions) {
      this.easiestQuestionsChartData = {
        labels: this.analyticsData.easiestQuestions.map((q) => q.questionText),
        datasets: [{
          data: this.analyticsData.easiestQuestions.map((q) => q.averageScore),
          label: 'Average Score',
          backgroundColor: '#28a745',
        }],
      };
    }

    // 10. Performance vs. Participation Correlation
    if (this.analyticsData.examPerformanceCorrelation) {
      const scatterData: ScatterPoint[] = this.analyticsData.examPerformanceCorrelation.map(e => ({
        x: e.studentCount,
        y: e.averageScore,
        examTitle: e.examTitle // Store extra data for tooltip
      }));

      this.correlationChartData = {
        datasets: [{
          data: scatterData,
          label: 'Exam',
          backgroundColor: '#ffc107',
          pointRadius: 6,
          pointHoverRadius: 8,
        }],
      };
    }
  }

  ngOnDestroy(): void {
    
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }
  }
}
