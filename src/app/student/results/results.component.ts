import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/exam.service';
import { ResultService } from '../../core/services/result.service';
import { AuthService } from '../../core/services/auth.service';
import { GetExamDataDTO } from '../../shared/models/exam.model';

// Import all necessary Angular Material modules
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-results',
  standalone: true, // Assuming this is a standalone component
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class ResultsComponent implements OnInit {
  exams: GetExamDataDTO[] = [];
  userId!: number;

  // State variables for dialogs
  isLoading = false;
  resultData: any = [];
  createResultLoader = false;
  createResultResponse: any;

  // References to the <ng-template> blocks in the HTML
  @ViewChild('resultDialog') resultDialog!: TemplateRef<any>;
  @ViewChild('createResultDialog') createResultDialog!: TemplateRef<any>;

  constructor(
    private examService: ExamService,
    private resultService: ResultService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserRole()?.id!;
    this.examService.getAvailableExams(this.userId).subscribe({
      next: (data) => (this.exams = data),
      error: (err) => console.error('Failed to load exams', err),
    });
  }

  viewResult(examId: number): void {
    this.isLoading = true;
    this.resultData = []; // Clear previous data
    const dialogRef = this.dialog.open(this.resultDialog, {
      panelClass: 'custom-dialog' // Apply our custom theme
    });

    this.resultService.viewResult(examId, this.userId).subscribe({
      next: (res) => {
        this.resultData = res;
        this.isLoading = false;
      },
      error: (err) => {
        // console.error('Could not view result, triggering creation...', err);
        dialogRef.close();
        this.triggerCreateResult(examId);
      },
    });
  }

  triggerCreateResult(examId: number): void {
    this.createResultLoader = true;
    this.createResultResponse = null; // Reset state
    this.dialog.open(this.createResultDialog, {
      disableClose: true,
      panelClass: 'custom-dialog' // Apply our custom theme
    });

    this.resultService.createResult(examId, this.userId).subscribe({
      next: (res:{status:number,msg:string}) => {
        this.createResultResponse = res.msg;
        this.createResultLoader = false;
      },
      error: (err) => {
        console.error('Error creating result', err.error);
        this.createResultResponse = null;
        this.createResultLoader = false;
      },
    });
  }

  onCloseCreateResultModal(): void {
    this.dialog.closeAll();
  }
}