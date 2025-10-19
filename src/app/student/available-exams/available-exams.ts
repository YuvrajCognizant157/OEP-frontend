import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvailableExam, ExamDetails } from '../../shared/models/exam.model';
import { ExamService } from '../../core/services/exam.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-available-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './available-exams.html',
  styleUrls: ['./available-exams.css']
})
export class AvailableExams implements OnInit {
  // Signals for managing state
  isLoading = signal(true);
  availableExams = signal<AvailableExam[]>([]);
  selectedExamDetails = signal<ExamDetails | null>(null);
  isModalOpen = signal(false);
  selectedExamId: number | null = null;

  constructor(
    private studentService: ExamService,
    private router: Router,
    private authS :AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAvailableExams();
  }

  fetchAvailableExams(): void {
    this.isLoading.set(true);
    let studentId : number = this.authS.getUserId() ?? 1;    
    this.studentService.getAvailableExams(studentId).subscribe({
      next: (data) => {
        this.availableExams.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching available exams:', err);
        this.isLoading.set(false);
      }
    });
  }

  openExamDetailsModal(examId: number): void {
    this.selectedExamId = examId;
    this.studentService.getExamDetails(examId).subscribe({
      next: (details) => {
        this.selectedExamDetails.set(details);
        this.isModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error fetching exam details:', err);
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedExamDetails.set(null);
    this.selectedExamId = null;
  }

  startExam(): void {
    if (this.selectedExamId) {
      this.router.navigate(['/student/start-exam', this.selectedExamId]);
    }
  }

  // To close the modal when clicking the overlay
  onModalClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}