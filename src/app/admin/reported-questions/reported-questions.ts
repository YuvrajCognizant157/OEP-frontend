import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { QuestionReviewDTO, QuestionReport, QuestionDetail } from '../../shared/models/admin.model';

@Component({
  selector: 'app-reported-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reported-questions.html',
  styleUrls: ['./reported-questions.css'],
})
export class ReportedQuestionsComponent implements OnInit {
  reports: QuestionReport[] = [];
  message: string = '';
  loading: boolean = false;

  // Modal related properties
  isModalVisible: boolean = false;
  modalLoading: boolean = false;
  selectedQuestion: QuestionDetail | null = null;
  parsedOptions: { key: string; value: string }[] = [];
  correctOptionKeys: string[] = [];

  constructor(private adminService: AdminService, private authS: AuthService) {}

  ngOnInit(): void {
    this.loadReportedQuestions();
  }

  loadReportedQuestions(): void {
    this.loading = true;
    this.adminService.getReportedQuestions(this.authS.getUserId()!).subscribe({
      next: (res) => {
        this.loading = false;
        if (typeof res === 'string' || res.length === 0) {
          this.message = 'No reported questions are currently available for review.';
          this.reports = [];
        } else {
          this.reports = res;
          this.message = '';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = '⚠️ An error occurred while loading reported questions.';
        console.error(err);
      },
    });
  }

  viewQuestion(qid: number): void {
    this.isModalVisible = true;
    this.modalLoading = true;
    this.selectedQuestion = null; // Clear previous data

    this.adminService.getQuestionDetailsById(qid).subscribe({
      next: (questionDetails) => {
        this.selectedQuestion = questionDetails;
        this.parseQuestionData();
        this.modalLoading = false;
      },
      error: (err) => {
        console.error(`Error fetching details for QID ${qid}`, err);
        this.modalLoading = false;
        this.closeModal();
        alert('Could not load question details. Please check the console.');
      },
    });
  }

  submitReview(qid: number, status: number): void {
    const payload: QuestionReviewDTO = { qid, status };

    // Disable buttons to prevent double-clicks
    this.modalLoading = true;

    this.adminService.reviewQuestion(payload).subscribe({
      next: (response) => {
        alert(response); // Show success message from backend
        this.closeModal();
        // Remove the reviewed question from the list for an instant UI update
        this.reports = this.reports.filter((report) => report.qid !== qid);
        if (this.reports.length === 0) {
          this.message = 'No reported questions are currently assigned to you.';
        }
      },
      error: (err) => {
        alert(`Failed to submit review: ${err.error}`);
        console.error(err);
        this.modalLoading = false; // Re-enable buttons on error
      },
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedQuestion = null;
    this.parsedOptions = [];
    this.correctOptionKeys = [];
  }

  // in reported-questions.ts

  private parseQuestionData(): void {
    // First, check if the question and its options string exist and are not empty.
    if (!this.selectedQuestion || !this.selectedQuestion.options) {
      this.parsedOptions = [{ key: 'Error', value: 'No options found for this question.' }];
      this.correctOptionKeys = [];
      return; // Stop execution here
    }

    try {
      // Parse the JSON string from the backend
      const optionsObj = JSON.parse(this.selectedQuestion.options);

      // Use the 'Object.entries' pattern to map the parsed object
      // This matches the logic from your other component for consistency.
      this.parsedOptions = Object.entries(optionsObj).map(([key, value]) => ({
        key: key,
        value: value as string,
      }));
    } catch (e) {
      // This will catch any actual JSON format errors
      console.error('Failed to parse options JSON:', e);
      this.parsedOptions = [
        { key: 'Error', value: 'Could not parse options JSON. The data format is invalid.' },
      ];
    }

    // Safely parse correct options
    try {
      if (this.selectedQuestion.correctOptions) {
        this.correctOptionKeys = JSON.parse(this.selectedQuestion.correctOptions);
      } else {
        this.correctOptionKeys = [];
      }
    } catch (e) {
      this.correctOptionKeys = [];
    }
  }

  isCorrectOption(optionKey: string): boolean {
    return this.correctOptionKeys.includes(optionKey);
  }
}
