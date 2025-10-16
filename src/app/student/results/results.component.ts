import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/exam.service';
import { ResultService } from '../../core/services/result.service';
import { GetExamDataDTO } from '../../shared/models/exam.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
})
export class ResultsComponent implements OnInit {
  exams: GetExamDataDTO[] = [];
  userId = 5;
  isLoading = false;
  resultData: any;
  showModal = false;
  hasTriedCreating = false;

  showCreateResultModal = false;
  createResultResponse: any;
  createResultLoader: boolean = false;

  @ViewChild('resultDialog') resultDialog!: TemplateRef<any>;
  @ViewChild('createResultDialog') createResultDialog!: TemplateRef<any>;

  constructor(
    private examService: ExamService,
    private resultService: ResultService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.examService.getExams().subscribe({
      next: (data) => (this.exams = data),
      error: (err) => console.error('Failed to load exams', err),
    });
  }

  openResultDialog(eid: number) {
    this.isLoading = true;
    this.dialog.open(this.resultDialog);

    // Simulate API call
    setTimeout(() => {
      this.resultData = { score: 85, attempts: 2 }; // replace with actual API result
      this.isLoading = false;
    }, 1500);
  }

  openCreateResultDialog() {
    this.createResultLoader = true;
    this.dialog.open(this.createResultDialog);

    setTimeout(() => {
      this.createResultLoader = false;
      this.createResultResponse = true; // or false based on API
    }, 2000);
  }

  onCloseCreateResultModal() {
    this.dialog.closeAll();
    this.createResultResponse = null;
  }

  viewResult(examId: number) {
    this.isLoading = true;
    this.showModal = true;
    this.resultService.viewResult(examId, this.userId).subscribe({
      next: (res) => {
        this.resultData = res;
        this.isLoading = false;

        if (!this.resultData && !this.hasTriedCreating) {
          this.hasTriedCreating = true;
          this.triggerCreateResult(examId);
        }
      },
      error: (err) => {
        console.error('Error viewing result', err);
        this.resultData = null;
        this.isLoading = false;

        if (!this.hasTriedCreating) {
          this.hasTriedCreating = true;
          this.triggerCreateResult(examId);
        }
      },
    });
  }

  triggerCreateResult(examId: number) {
    this.createResultLoader = true;
    this.showCreateResultModal = true;

    this.resultService.createResult(examId, this.userId).subscribe({
      next: (res) => {
        this.createResultResponse = res;
        this.createResultLoader = false;

        // After creating result, try viewing it again
        this.viewResult(examId);
      },
      error: (err) => {
        console.error('Error creating result', err.error);
        this.createResultResponse = null;
        this.createResultLoader = false;
      },
    });
  }

  // onCloseCreateResultModal() {
  //   this.showCreateResultModal = false;
  // }
}
