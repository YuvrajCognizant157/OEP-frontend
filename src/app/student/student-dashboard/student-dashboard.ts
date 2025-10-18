import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, OnInit } from '@angular/core';
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
import { SimplifiedResult, RawResultDTO } from '../../shared/models/result.model';
import { RouterLink } from '@angular/router';
import { OverallAverageScoreTopicWise } from './student-dashboard.model';

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
    RouterLink
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {

  public userFullName: string = 'Student';
  public isLoading: boolean = true;


  // ⬇️ Properties updated from analytics service
  public questionsEncounteredTotal: number = 0;
  public examsAppearedTotal: number = 0;

  public availableExamsList: SimplifiedExam[] = [];
  public examResultsHistory: SimplifiedResult[] = [];


  student = {
    id: 0,
    name: 'John Doe',
    email: 'johndoe@example.com',
    examsAppeared: 12
  };

  percentageAnalytics = {
    questionsEncounteredPercent: 0,
    examsAttemptedPercent: 0
  }

  basicAnalytics = {
    totalQuestions: 0,
    totalExams: 0
  };

  constructor(private profileService: ProfileService,
    private resultService: ResultService,
    private analyticsService: AnalyticsService,
    private examService: ExamService

  ) { }

  ngOnInit(): void {
    // 1. Fetch Profile Data
    this.profileService.getUserProfile()?.subscribe({
      next: (profileData) => {
        if (profileData && profileData.fullName) {
          this.userFullName = profileData.fullName;
          this.student.name = profileData.fullName;
          this.student.email = profileData.email;
          this.student.id = profileData.id ?? this.student.id;

          if (this.student.id) {
            this.loadAllAnalytics(this.student.id); // ⬅️ Call the new chaining method
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
      }
    });
  }

  private loadAllAnalytics(userId: number): void {
    this.isLoading = true;

    // Use forkJoin to wait for all three necessary async calls to complete
    forkJoin({
      studentAnalytics: this.analyticsService.getStudentAnalytics(userId),
      totalExams: this.analyticsService.getTotalActiveExams(),
      totalQuestions: this.analyticsService.getTotalActiveQuestions(),
      examData: this.processExamData(this.examService.getExams()),
      resultData: this.processResultsData(this.resultService.viewResultsByUserId(userId) as Observable<RawResultDTO[]>)
    }).subscribe({
      next: (results) => {
        // 1. Process Student Analytics
        const studentData = results.studentAnalytics;
        if (studentData && studentData.value) {
          this.questionsEncounteredTotal = studentData.value.totalQuestionsEncountered || 0;
          this.examsAppearedTotal = studentData.value.totalExamsTaken || 0;
          this.student.examsAppeared = this.examsAppearedTotal;
          this.updateTopicChart(studentData.value.overallAverageScoreTopicWise);
        }

        // 2. Process Total Counts
        this.basicAnalytics.totalExams = results.totalExams || 0;
        this.basicAnalytics.totalQuestions = results.totalQuestions || 0;
        this.availableExamsList = results.examData;
        this.examResultsHistory = results.resultData;
        // 3. NOW ALL DATA IS READY, PERFORM CALCULATION
        this.calcBasicAnalyticsPercent();

        this.isLoading = false; // Stop loading only when everything is done
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  private updateTopicChart(topicData: OverallAverageScoreTopicWise[]): void {
      // 1. Take only the first four elements
      const limitedData = topicData.slice(0, 4);

      // 2. Extract Labels (Topic names) and Data (Average Scores)
      const labels = limitedData.map(item => item.topic);
      const scores = limitedData.map(item => item.averageScore);

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
                  borderWidth: 2
              }
          ]
      };
  }

  private processResultsData(resultObservable: Observable<RawResultDTO[]>): Observable<SimplifiedResult[]> {
    return resultObservable.pipe(
      map((results: RawResultDTO[]) => {
        // Map the array of RawResultDTO to the array of SimplifiedResult
        return results.map(result => ({
          eid: result.eid,
          examName: result.examName,
          attempts: result.attempts,
          score: result.score,
          takenOn: new Date(result.takenOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          }),
          totalMarks: result.totalMarks,
        })) as SimplifiedResult[];
      })
    );
  }

  private processExamData(examObservable: Observable<GetExamDataDTO[]>): Observable<SimplifiedExam[]> {
    return examObservable.pipe(
      map((exams: GetExamDataDTO[]) => {
        // Map the array of GetExamDataDTO to the array of SimplifiedExam
        return exams.map(exam => ({
          eid: exam.eid,
          examName: exam.name,
          duration: exam.duration,
          totalMarks: exam.totalMarks
        }));
      })
    );
  }


  calcBasicAnalyticsPercent() {

    if (this.basicAnalytics.totalExams > 0) {
      this.percentageAnalytics.examsAttemptedPercent =
        (this.examsAppearedTotal / this.basicAnalytics.totalExams) * 100;
    } else {
      this.percentageAnalytics.examsAttemptedPercent = 0;
    }

    if (this.basicAnalytics.totalQuestions > 0) {
      this.percentageAnalytics.questionsEncounteredPercent =
        (this.questionsEncounteredTotal / this.basicAnalytics.totalQuestions) * 100;
    } else {
      this.percentageAnalytics.questionsEncounteredPercent = 0;
    }
    console.log('Calculation complete. Percentage Analytics:', this.percentageAnalytics);
  }


  availableExams = [

  ];

  examHistory = [
    { title: 'Node.js Fundamentals', score: 42, total: 50, date: '2025-08-12', passed: true },
    { title: 'Database Design', score: 65, total: 100, date: '2025-09-10', passed: false }
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
      }
    ]
  };

  topicExamsChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Exams Appeared',
        backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  topicExamsChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } }
    }
  };


  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { labels: { color: '#fff' } }
    },
    scales: {
      x: {
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Dark theme grid
      },
      y: {
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Dark theme grid
      }
    }
  };

  startExam(id: number) {
    console.log('Starting exam', id);
  }
}