import { Component, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
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
import { ResultCalculationResponseDTO } from '../../shared/models/result.model';
import { Result } from './results.model';

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
  resultData = signal<Result[] >([]);

  // References to the <ng-template> blocks in the HTML
  @ViewChild('resultDialog') resultDialog!: TemplateRef<any>;

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
    this.resultData.set( []); // Clear previous data
    const dialogRef = this.dialog.open(this.resultDialog, {
      panelClass: 'custom-dialog' // Apply our custom theme
    });

    this.resultService.createAndViewResult(examId,this.userId).subscribe({
      next: (res:ResultCalculationResponseDTO) =>{
        this.resultData.set(res.results);        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Could not create and view result, triggering creation...', err);
        dialogRef.close();
      }
    })

  }

  onCloseCreateResultModal(): void {
    this.dialog.closeAll();
  }
}