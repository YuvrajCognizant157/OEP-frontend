import { Component } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';

import { AddRemarkDialog } from '../add-remark-dialog/add-remark-dialog.component';

@Component({

  selector: 'app-exam-feedback',

  templateUrl: './exam-feedback.html',

  styleUrls: ['./exam-feedback.css']

})

export class ExamFeedbackComponent {

  examId: number | null = null;

  feedbacks: any[] = [];

  displayedColumns = ['eid', 'feedback', 'studentId', 'actions'];

  loading = false;

  constructor(

    private adminService: AdminService,

    private snackBar: MatSnackBar,

    private dialog: MatDialog

  ) {}

  /** ✅ Load feedbacks */

  loadFeedbacks(): void {

    if (!this.examId) {

      this.snackBar.open('Please enter an exam ID first!', 'Close', { duration: 3000 });

      return;

    }

    this.loading = true;

    this.adminService.getExamFeedback(this.examId).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (!res || res.length === 0) {

          this.feedbacks = [];

          this.snackBar.open('No feedbacks found for this exam.', 'Close', { duration: 3000 });

          return;

        }

        // ✅ Filter to show only feedbacks with approvalStatus != 0

        this.feedbacks = res.filter((f: any) => f.approvalStatus !== 0);

        if (this.feedbacks.length === 0) {

          this.snackBar.open('No pending feedbacks for approval.', 'Close', { duration: 3000 });

        }

      },

      error: (err) => {

        this.loading = false;

        console.error('Error loading feedbacks:', err);

        this.snackBar.open('Error loading feedbacks.', 'Close', { duration: 3000 });

      }

    });

  }

  /** ✅ Open remark dialog and refresh after adding */

  openRemarkDialog(feedback: any): void {

    const dialogRef = this.dialog.open(AddRemarkDialog, {

      width: '400px',

      data: { examId: feedback.eid }

    });

    dialogRef.afterClosed().subscribe((remark) => {

      if (remark) {

        this.adminService.addAdminRemarks(feedback.eid, remark).subscribe({

          next: () => {

            this.snackBar.open('Remark added successfully ✅', 'Close', { duration: 3000 });

            this.loadFeedbacks(); // ✅ auto refresh after remark

          },

          error: () => {

            this.snackBar.open('Failed to add remark ❌', 'Close', { duration: 3000 });

          }

        });

      }

    });

  }

}
 