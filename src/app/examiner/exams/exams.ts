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
import { MatChip } from '@angular/material/chips';
import { Router } from '@angular/router';
// Define the interface for a single Exam object
export interface Exam {
  eid: number;
  name: string;
  description: string;
  duration: number;
  totalQuestions: number;
  displayedQuestions: number;
  totalMarks: number;
  marksPerQuestion: number;
  approvalStatus: number;
  submittedForApproval: boolean;
  adminRemarks: string | null;
  tids: number[];
  topicNames: number[];
  userId: number;
  reviewerId: number | null;
  questions: any[];
  examFeedbacks: any[];
  responses: any[];
  results: any[];
  reviewer: any | null;
  user: any | null;
}

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
    MatChip,
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {
  exams: Exam[] = [];
  selectedExam: Exam | null = null;
  isModalOpen: boolean = false;
  tids: number[] = [];

  isUpdateModalOpen = signal<boolean>(false);
  examToUpdate = signal<Exam | null>(null);

  constructor(private examinerService: ExaminerService, private authService: AuthService,private router:Router) {}

  userId = -1;

  ngOnInit(): void {
    let tokenDetails: userDetails = this.authService.getUserRole()!;
    this.userId = tokenDetails?.id;
    this.fetchExams();
  }

  fetchExams(): void {
    this.examinerService.getExamsForExaminer(this.userId).subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
      },
      error: (err) => {
        console.error('Error fetching exams:', err.error);
      },
    });
  }

  viewExamDetails(examId: number): void {
    this.examinerService.getExamById(examId).subscribe({
      next: (data: Exam) => {
        this.selectedExam = data;
        this.isModalOpen = true;
      },
      error: (error) => {
        console.error('Error fetching exam details:', error);
      },
    });
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

  // ADDED: New method for the add question button
  onAddQuestion(examId: number): void {
    this.router.navigate([`/examiner/dashboard/add-questions/${examId}`]);
    console.log('Add question to exam ID:', examId);
  }

  sendExamForApproval(examId: number): void {
    this.examinerService.sendExamForApproval(examId).subscribe({
      next: (response: any) => {
        alert(response.msg || 'Exam submitted for approval successfully!');

        this.exams = this.exams.map((exam) => {
          if (exam.eid === examId) {
            return { ...exam, submittedForApproval: true };
          }
          return exam;
        });
      },
      error: (err) => {
        console.error('Failed to send exam for approval:', err.error.msg);
        alert(`An error occurred while submitting the exam. ${err.error.msg}`);
      },
    });
  }

  getApprovalStatus(
    status: number,
    approval: boolean
  ): { text: string; class: string; matColor?: 'primary' | 'accent' | 'warn' } {
    if (status === 1) {
      return { text: 'Approved', class: 'status-approved', matColor: 'accent' };
    }
    if (status === 0 && approval === true) {
      return { text: 'Submitted For Approval', class: 'status-awaited', matColor: 'primary' };
    }
    if (status === 0) {
      return { text: 'Pending', class: 'status-pending', matColor: 'primary' };
    }
    return { text: 'Rejected', class: 'status-rejected', matColor: 'warn' };
  }

  onExamUpdated(): void {
    this.closeUpdateModal();
    this.fetchExams();
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen.set(false);
    this.examToUpdate.set(null);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExam = null;
  }
}