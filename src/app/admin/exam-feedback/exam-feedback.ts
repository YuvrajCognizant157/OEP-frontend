import { Component, OnInit } from '@angular/core';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminService } from '../../core/services/admin.service';
import { MatCardModule } from '@angular/material/card';

import { AddRemarkDialogComponent } from '../add-remark-dialog/add-remark-dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({

  selector: 'app-exam-feedback',

  standalone:true,

  imports:[MatSnackBarModule,MatDialogModule,CommonModule,FormsModule,MatProgressSpinnerModule,MatCardModule],

  templateUrl: './exam-feedback.html',

  styleUrls: ['./exam-feedback.css'],

})

export class ExamFeedbackComponent implements OnInit {

  examId: number | null = null;

  feedbacks: any[] = [];

  loading = false;

  constructor(

    private adminService: AdminService,

    private snackBar: MatSnackBar,

    private dialog: MatDialog

  ) {}

  ngOnInit(): void {}

  // ✅ Load feedbacks based on Exam ID

  loadFeedbacks(): void {

    if (!this.examId) {

      this.snackBar.open('⚠️ Please enter an Exam ID first!', 'Close', {

        duration: 3000,

      });

      return;

    }

    this.loading = true;

    this.adminService.getExamFeedback(this.examId).subscribe({

      next: (res) => {

        this.loading = false;

        if (res && res.length > 0) {

          this.feedbacks = res;

        } else {

          this.feedbacks = [];

          this.snackBar.open('No feedbacks found for this exam.', 'Close', {

            duration: 3000,

          });

        }

      },

      error: (err) => {

        this.loading = false;

        console.error(err);

        this.snackBar.open('Error loading feedbacks!', 'Close', {

          duration: 3000,

        });

      },

    });

  }

  // ✅ Add Admin Remark

  openRemarkDialog(feedback: any): void {

    const dialogRef = this.dialog.open(AddRemarkDialogComponent, {

      width: '400px',

      disableClose: true,

      data: feedback,

    });

    dialogRef.afterClosed().subscribe((remark) => {

      if (!remark) return;

      this.adminService.addAdminRemarks(feedback.eid, remark).subscribe({

        next: (res) => {

          this.snackBar.open('✅ Remark added successfully!', 'Close', {

            duration: 3000,

          });

          this.loadFeedbacks();

        },

        error: (err) => {

          console.error(err);

          this.snackBar.open('Failed to add remark!', 'Close', {

            duration: 3000,

          });

        },

      });

    });

  }

}
 