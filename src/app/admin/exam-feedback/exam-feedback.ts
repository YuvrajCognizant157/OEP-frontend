import { Component, OnInit } from '@angular/core';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminService } from '../../core/services/admin.service';

import { AddRemarkDialogComponent } from '../add-remark-dialog/add-remark-dialog';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatCardModule } from '@angular/material/card';

@Component({

  selector: 'app-exam-feedback',

  standalone: true,

  imports: [

    MatSnackBarModule,

    MatDialogModule,

    CommonModule,

    FormsModule,

    MatProgressSpinnerModule,

    MatCardModule

  ],

  templateUrl: './exam-feedback.html',

  styleUrls: ['./exam-feedback.css']

})


export class ExamFeedbackComponent implements OnInit {
  

  feedbacks: any[] = [];

  loading = false;

  constructor(

    private adminService: AdminService,

    private snackBar: MatSnackBar,

    private dialog: MatDialog

  ) {}

  ngOnInit(): void {

  // 🧠 Step 1: Get local storage values

  const storedUserId = localStorage.getItem('userId');

  const storedUserRole = localStorage.getItem('userRole');

  console.log('LocalStorage values:', { storedUserId, storedUserRole });

  // 🧩 Step 2: Validate

  if (!storedUserId || !storedUserRole) {

    this.snackBar.open('⚠️ Unable to find logged-in user info', 'Close', {

      duration: 3000,

    });

    return;

  }

  // 🧩 Step 3: Confirm admin role (case-insensitive)

  if (storedUserRole.toLowerCase() !== 'admin') {

    this.snackBar.open('⚠️ Access denied! Only Admins can view feedbacks.', 'Close', {

      duration: 3000,

    });

    return;

  }

  // 🧩 Step 4: Convert userId string to number

  const userId = Number(storedUserId);

  if (isNaN(userId) || userId <= 0) {

    this.snackBar.open('⚠️ Invalid user ID detected.', 'Close', {

      duration: 3000,

    });

    return;

  }

  // ✅ Step 5: Load exam feedbacks

  console.log('✅ Logged-in Admin ID:', userId);

  this.loadFeedbacks(userId);

}
 

  // Load feedbacks based on logged-in admin userId

  loadFeedbacks(userId: number): void {

    this.loading = true;

    this.adminService.getExamFeedback(userId).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res && res.length > 0) {

          this.feedbacks = res;

        } else {

          this.feedbacks = [];

          this.snackBar.open('No feedbacks found for your assigned exams.', 'Close', {

            duration: 3000

          });

        }

      },

      error: (err) => {

        this.loading = false;

        console.error(err);

        this.snackBar.open('Error loading feedbacks!', 'Close', {

          duration: 3000

        });

      }

    });

  }

  // Add Admin Remark Dialog

  openRemarkDialog(feedback: any): void {

    const dialogRef = this.dialog.open(AddRemarkDialogComponent, {

      width: '400px',

      disableClose: true,

      data: feedback

    });

    dialogRef.afterClosed().subscribe((remark) => {

      if (!remark) return;

      this.adminService.addAdminRemarks(feedback.eid, remark).subscribe({

        next: (res) => {

          this.snackBar.open('✅ Remark added successfully!', 'Close', {

            duration: 3000

          });

          // Reload feedbacks

          const storedUser = localStorage.getItem('userId');

          if (storedUser) {

            const userId = Number(storedUser);

        

            this.loadFeedbacks(userId);

          }

        },

        error: (err) => {

          console.error(err);

          this.snackBar.open('❌ Failed to add remark!', 'Close', {

            duration: 3000

          });

        }

      });

    });

  }

}
 