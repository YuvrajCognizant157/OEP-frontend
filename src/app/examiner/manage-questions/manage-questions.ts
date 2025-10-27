import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuestionService } from '../../core/services/question.service';
import { TopicsService } from '../../core/services/topics.service';
import { ExamService } from '../../core/services/exam.service';
import { AuthService } from '../../core/services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { QuestionDetailsDialog } from './question-details-dialog/question-details-dialog';


@Component({
  selector: 'app-manage-questions',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule, 
    MatInputModule,
    QuestionDetailsDialog
],
  templateUrl: './manage-questions.html',
  styleUrl: './manage-questions.css'
})
export class ManageQuestions implements OnInit {

  questions: any[] = [];
  dataSource = new MatTableDataSource<any>(this.questions);
  totalQuestions = 0;
  pageSize = 5;
  currentPage = 0;
  isLoading = false;
  userId!: number;
  searchQuery: string = '';


  displayedColumns: string[] = ['questionId', 'questionName', 'questionType', 'actions'];

  constructor(
    private questionService: QuestionService,
    private authS: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authS.getUserId()!;
    this.fetchQuestions();
  }

  fetchQuestions(page: number = 1): void {
    this.isLoading = true;
    this.questionService.getQuestionsByExaminer(this.userId, page, this.pageSize).subscribe({
      next: (res: any) => {
        console.log('Fetched questions:', res);

        this.questions = res.results || [];
        this.totalQuestions = res.totalCount || 0;
        this.dataSource = new MatTableDataSource(this.questions);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
        this.isLoading = false;
      },
    });
  }

  viewQuestionDetails(questionId: number): void {
    // 🔑 Open the dialog and pass the necessary ID
    this.dialog.open(QuestionDetailsDialog, {
      width: '600px', // Customize width as needed
      maxWidth: '90vw', // Ensure responsiveness
      data: { 
        questionId: questionId 
      }
    });
  }

  applyFilter(): void {
    // Trim and convert input value to lowercase for case-insensitive filtering
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchQuestions(this.currentPage + 1);
  }

  openAddQuestionDialog(): void {
    const dialogRef = this.dialog.open(SelectExamDialog, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((examId) => {
      console.log('Selected exam ID:', examId);

      if (examId) {
        console.log('Navigating to add questions for exam ID:', examId);

        this.router.navigate([`/examiner/dashboard/add-questions/${examId}`]);
      }
    });
  }

  updateQuestion(questionId: number): void {
    this.router.navigate([`/examiner/dashboard/update-question/${questionId}`]);
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          alert('Question deleted successfully!');
          this.fetchQuestions(this.currentPage + 1);
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          alert('Failed to delete question');
        },
      });
    }
  }
}

@Component({
  selector: 'select-exam-dialog',
  template: `
    <h2 mat-dialog-title>Select an Unapproved Exam</h2>
    <mat-dialog-content>
      <ng-container *ngIf="!isLoading; else loading">
        <mat-list *ngIf="unapprovedExams.length > 0; else noExams">
          <mat-list-item *ngFor="let exam of unapprovedExams" (click)="selectExam(exam.eid)"
          class="select-item"
          style="background-color: #333; color: #fff; border-radius: 4px; margin-bottom: 5px; cursor: pointer;">
            {{ exam.name }}
          </mat-list-item>
        </mat-list>
      </ng-container>

      <ng-template #loading>
        <div class="spinner"><mat-spinner diameter="40"></mat-spinner></div>
      </ng-template>

      <ng-template #noExams>
        <p>No unapproved exams found.</p>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
        .select-item {
            transition: background-color 0.15s ease-in-out;
            padding: 10px; /* Add internal padding */
        }
        .select-item:hover {
            background-color: #4a4a4a !important; /* Slightly lighter gray on hover */
        }
        .spinner {
            display: flex;
            justify-content: center;
            padding: 20px;
        }
    `],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule, MatProgressSpinnerModule],
})
export class SelectExamDialog implements OnInit {
  unapprovedExams: any[] = [];
  isLoading = false;
  userId!: number;

  constructor(
    private dialogRef: MatDialogRef<SelectExamDialog>,
    private questionService: QuestionService,
    private examService: ExamService,
    private authS: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authS.getUserId()!;
    this.isLoading = true;
    this.examService.getUnapprovedExams(this.userId).subscribe({
      next: (res: any) => {
        this.unapprovedExams = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching unapproved exams:', err);
        this.isLoading = false;
      },
    });
  }

  selectExam(examId: number): void {
    this.dialogRef.close(examId);
  }

}
