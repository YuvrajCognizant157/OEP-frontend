import { Component, OnInit, signal } from '@angular/core';
import { ExaminerService } from '../../core/services/examiner.service';
import { CommonModule } from '@angular/common';
import { ExamModal } from './exam-modal/exam-modal';
import { UpdateExamModal } from './update-exam-modal/update-exam-modal';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, userDetails } from '../../core/services/auth.service';
@Component({
  selector: 'app-exams',
  imports: [
    CommonModule,
    ExamModal,
    UpdateExamModal,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {
  exams: any[] = [];
  selectedExam: any = null; // Holds the data for the modal
  isModalOpen: boolean = false;

  isUpdateModalOpen = signal<boolean>(false);
  examToUpdate = signal<any | null>(null);

  constructor(private examinerService: ExaminerService,private authService: AuthService) {}

  userId = -1;

  ngOnInit(): void {
    let tokenDetails:userDetails = this.authService.getUserRole()!;
    this.userId = tokenDetails?.id;
    this.fetchExams();
  }

  fetchExams(): void {
    this.examinerService.getExamsForExaminer(this.userId).subscribe({
      next: (data) => {
        this.exams = data;
      },
      error: (err) => {
        console.error('Error fetching exams:', err.error);
      },
    });
  }

  viewExamDetails(examId: number): void {
    this.examinerService.getExamById(examId).subscribe({
      next: (data) => {
        this.selectedExam = data;
        this.isModalOpen = true;
      },
      error: (error) => {
        console.error('Error fetching exam details:', error);
      },
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExam = null;
  }

  onUpdateExam(examId: number): void {
    // 1. Fetch the data first (GetExamByIdForExaminerAction already does this)
    this.examinerService.getExamById(examId).subscribe({
      next: (data) => {
        // 2. Set the data for the modal input
        this.examToUpdate.set(data);
        // 3. Open the modal
        this.isUpdateModalOpen.set(true);
      },
      error: (error) => {
        console.error('Error fetching exam details for update:', error);
      },
    });
  }

  onDeleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examinerService.deleteExam(examId).subscribe({
        next: (data) => {
          console.log(`Exam with ID ${examId} deleted successfully.`);
          this.fetchExams(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
        },
      });
    }
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen.set(false);
    this.examToUpdate.set(null);
  }

  onExamUpdated(): void {
    this.closeUpdateModal();
    this.fetchExams();
  }
}
