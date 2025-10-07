import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/exam.service';
import { ResultService } from '../../core/services/result.service';
import { GetExamDataDTO } from '../../shared/models/exam.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [CommonModule],
})
export class ResultsComponent implements OnInit {
  exams: GetExamDataDTO[] = [];
  userId = 5; // Replace with actual logged-in user ID
  isLoading = false;
  resultData: any;
  showModal = false;
  hasTriedCreating = false;

  showCreateResultModal = false;
  createResultResponse: any;
  createResultLoader: boolean = false;

  constructor(private examService: ExamService, private resultService: ResultService) {}

  ngOnInit(): void {
    this.examService.getExams().subscribe({
      next: (data) => (this.exams = data),
      error: (err) => console.error('Failed to load exams', err),
    });
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
    }
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
    }
  });
}

  onCloseCreateResultModal() {
    this.showCreateResultModal = false;
  }
}
