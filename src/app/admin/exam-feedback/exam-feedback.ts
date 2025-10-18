import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatTableModule } from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/services/admin.service';

import { AddRemarkDialog } from '../add-remark-dialog/add-remark-dialog';

import { MatSpinner } from '@angular/material/progress-spinner';

@Component({

  selector: 'app-exam-feedback',

  standalone: true,

  imports: [

    CommonModule,

    MatFormFieldModule,

    MatInputModule,

    MatTableModule,

    MatButtonModule,

    MatSnackBarModule,

    MatDialogModule,

     MatSpinner,

    FormsModule

  ],

  templateUrl: './exam-feedback.html',

  styleUrls: ['./exam-feedback.css']

})

export class ExamFeedbackComponent {

  examId: number | null = null;

  feedbacks: any[] = [];

  displayedColumns = ['eid', 'feedback', 'studentId', 'actions'];

  loading = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  loadFeedbacks() {

    if (!this.examId) {

      this.snackBar.open('Please enter an exam ID first!', 'Close', { duration: 3000 });

      return;

    }

    this.loading = true;

    this.adminService.getExamFeedback(this.examId).subscribe({

      next: (res) => {

        this.feedbacks = res;

        this.loading = false;

      },

      error: () => {

        this.snackBar.open('No feedbacks found for this exam ❌', 'Close', { duration: 3000 });

        this.loading = false;

      }

    });

  }

  openRemarkDialog(feedback: any) {

    const dialogRef = this.dialog.open(AddRemarkDialog, {

      width: '400px',

      data: { examId: feedback.eid }

    });

    dialogRef.afterClosed().subscribe((remark) => {

      if (remark) {

        this.adminService.addAdminRemarks(feedback.eid, remark).subscribe({

          next: () => {

            this.snackBar.open('Remark added successfully ✅', 'Close', { duration: 3000 });

            this.loadFeedbacks();

          },

          error: () => {

            this.snackBar.open('Failed to add remark ❌', 'Close', { duration: 3000 });

          }

        });

      }

    });

  }

}
 