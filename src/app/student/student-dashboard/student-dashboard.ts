import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../core/services/profile.service';
import { ResultService } from '../../core/services/result.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ExamService } from '../../core/services/exam.service';
import { forkJoin, map, Observable } from 'rxjs';
import { SimplifiedExam, GetExamDataDTO } from '../../shared/models/exam.model';
import { SimplifiedResult, RawResultDTO, ExamResultSummary } from '../../shared/models/result.model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OverallAverageScoreTopicWise } from './student-dashboard.model';
import { LayoutService } from '../../core/services/layout.service';

interface IPercentageAnalytics {
  questionsEncounteredPercent: number;
  examsAttemptedPercent: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboardComponent implements OnInit,OnDestroy {

  private sLayoutService = inject(LayoutService);
  
  public userFullName: string = 'Student';
  public isLoading: boolean = true;

  // ⬇️ Properties updated from analytics service
  public questionsEncounteredTotal: number = 0;
  public examsAppearedTotal = signal<number>(0);

  public availableExamsList: SimplifiedExam[] = [];
  public examResultsHistory: ExamResultSummary[] = [];

  student = {
    id: 0,
    name: 'John Doe',
    email: 'johndoe@example.com',
    examsAppeared: 12,
  };

  public percentageAnalytics = signal<IPercentageAnalytics>({
    questionsEncounteredPercent: 0,
    examsAttemptedPercent: 0,
  });

  basicAnalytics = {
    totalQuestions: 0,
    totalExams: 0,
  };

  constructor(
    private profileService: ProfileService,
    private resultService: ResultService,
    private analyticsService: AnalyticsService,
    private examService: ExamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. Fetch Profile Data

    this.sLayoutService.hideSLayout();

    this.profileService.getUserProfile()?.subscribe({
      next: (profileData) => {
        if (profileData && profileData.fullName) {
          this.userFullName = profileData.fullName;
          this.student.name = profileData.fullName;
          this.student.email = profileData.email;
          this.student.id = profileData.id ?? this.student.id;

          if (this.student.id) {
            this.loadAllAnalytics(this.student.id);
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
        this.userFullName = 'Guest User';
        this.isLoading = false;
      },
    });
  }

  private loadAllAnalytics(userId: number): void {
    this.isLoading = true;

    console.log('Loading dashboard data for user ID:', userId);

    // Use forkJoin to wait for all three necessary async calls to complete
    forkJoin({
      studentAnalytics: this.analyticsService.getStudentAnalytics(userId),
      totalExams: this.analyticsService.getTotalActiveExams(),
      totalQuestions: this.analyticsService.getTotalActiveQuestions(),
      examData: this.processExamData(this.examService.getAvailableExams(userId)),
      resultData: this.resultService.viewResultsByUserId(userId) as Observable<ExamResultSummary[]>,
    }).subscribe({
      next: (results) => {
        console.log('Dashboard data loaded:', results);

        // 1. Process Student Analytics
        const studentData = results.studentAnalytics;
        if (studentData && studentData.value) {
          this.questionsEncounteredTotal = studentData.value.totalQuestionsEncountered || 0;
          this.examsAppearedTotal.set(studentData.value.totalExamsTaken || 0);
          this.student.examsAppeared = this.examsAppearedTotal();
          this.updateTopicChart(studentData.value.overallAverageScoreTopicWise);
          this.updateAttemptsChart(studentData.value.examAttemptsRecords);
        }

        // 2. Process Total Counts
        this.basicAnalytics.totalExams = results.totalExams || 0;
        this.basicAnalytics.totalQuestions = results.totalQuestions || 0;
        this.availableExamsList = results.examData;
        // sort by most recent attempt date (descending)
        this.examResultsHistory = (results.resultData || []).sort((a: any, b: any) => {
          const aLast = a.attemptsData && a.attemptsData.length
            ? Math.max(...a.attemptsData.map((x: any) => new Date(x.takenOn).getTime()))
            : 0;
          const bLast = b.attemptsData && b.attemptsData.length
            ? Math.max(...b.attemptsData.map((x: any) => new Date(x.takenOn).getTime()))
            : 0;
          return bLast - aLast; // descending: most recent first
        });
        // 3. NOW ALL DATA IS READY, PERFORM CALCULATION
        this.calcBasicAnalyticsPercent();

        this.isLoading = false; // Stop loading only when everything is done
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      },
    });
  }

  private updateAttemptsChart(records: {
    singleAttempts: number;
    doubleAttempts: number;
    trippleAttempts: number;
  }): void {
    this.attemptsChartData = {
      ...this.attemptsChartData, // Keep existing labels and colors
      datasets: [
        {
          ...this.attemptsChartData.datasets[0],
          data: [records.singleAttempts, records.doubleAttempts, records.trippleAttempts],
        },
      ],
    };
  }

  private updateTopicChart(topicData: OverallAverageScoreTopicWise[]): void {
    // 1. Take only the first four elements
    const limitedData = topicData.slice(0, 4);

    // 2. Extract Labels (Topic names) and Data (Average Scores)
    const labels = limitedData.map((item) => item.topic);
    const scores = limitedData.map((item) => item.averageScore);

    // 3. Update the chart data structure
    this.topicExamsChartData = {
      labels: labels,
      datasets: [
        {
          // The data property of the first dataset is updated with the scores
          data: scores,
          label: 'Average Score', // Changed label to reflect the data
          backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }


  private processExamData(
    examObservable: Observable<GetExamDataDTO[]>
  ): Observable<SimplifiedExam[]> {
    //console.log('Processing exam data observable:', examObservable);

    return examObservable.pipe(
      map((exams: GetExamDataDTO[]) => {
        console.log('Raw exam data received:', exams);

        // Map the array of GetExamDataDTO to the array of SimplifiedExam
        return exams.map((exam) => ({
          eid: exam.eid,
          examName: exam.name,
          duration: exam.duration,
          totalMarks: exam.totalMarks,
        }));
      })
    );
  }

  calcBasicAnalyticsPercent() {
    let examsAttemptedPercent = 0;
    let questionsEncounteredPercent = 0;

    if (this.basicAnalytics.totalExams > 0) {
      examsAttemptedPercent = +(
        (this.examsAppearedTotal() / this.basicAnalytics.totalExams) *
        100
      ).toFixed(1);
    }

    if (this.basicAnalytics.totalQuestions > 0) {
      questionsEncounteredPercent = +(
        (this.questionsEncounteredTotal / this.basicAnalytics.totalQuestions) *
        100
      ).toFixed(1);
    }

    this.percentageAnalytics.set({
      examsAttemptedPercent,
      questionsEncounteredPercent,
    });

    console.log('Calculation complete. Percentage Analytics:', this.percentageAnalytics());
  }

  availableExams = [];

  examHistory = [
    { title: 'Node.js Fundamentals', score: 42, total: 50, date: '2025-08-12', passed: true },
    { title: 'Database Design', score: 65, total: 100, date: '2025-09-10', passed: false },
  ];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [80, 72, 90],
        label: 'Average %',
        backgroundColor: '#90caf9',
        borderColor: '#90caf9',
        borderWidth: 1,
      },
    ],
  };

  public attemptsChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Single Attempts', 'Double Attempts', 'Triple Attempts'],
    datasets: [
      {
        data: [], // Placeholder data
        label: 'Exam Attempts Distribution',
        backgroundColor: ['#29b6f6', '#ffb74d', '#ef5350'], // Blue, Orange, Red
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // ⬅️ NEW Property for Attempts Chart Options (can reuse existing pie options)
  public attemptsChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { labels: { color: '#fff' } },
    },
  };

  public topicExamsChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Exams Appeared',
        backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  public topicExamsChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
    scales: {
      x: {
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Dark theme grid
      },
      y: {
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Dark theme grid
      },
    },
  };

  startExam(id: number) {
    if (id) {
      this.router.navigate(['/student/start-exam', id]);
    } else {
      alert("Couldn't get access to the examId");
    }
  }


  get hasAttemptsData(): boolean {
    if (!this.attemptsChartData || !this.attemptsChartData.datasets || this.attemptsChartData.datasets.length === 0) {
      return false;
    }

    const total = this.attemptsChartData.datasets[0].data.reduce((sum, current) => sum + current, 0);
    return total > 0;
  }

  // 2. Getter for Exams Appeared by Topic Chart
  get hasTopicData(): boolean {
 
    if (!this.topicExamsChartData || !this.topicExamsChartData.datasets || this.topicExamsChartData.datasets.length === 0) {
      return false;
    }

    const total = this.topicExamsChartData.datasets[0].data.reduce((sum, current) => sum + current, 0);
    return total > 0;
  }

  ngOnDestroy(): void {
    this.sLayoutService.showSLayout();
  }
}