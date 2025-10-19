import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '../../core/services/admin.service';

import { AdminExam } from '../../shared/models/admin-exam.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-approve-exam',

  standalone:true,

  imports:[CommonModule,FormsModule],

  templateUrl: './approve-exam.html',

  styleUrls: ['./approve-exam.css'],

})

export class ApproveExamComponent implements OnInit {

  exams: AdminExam[] = [];

  loading = false;

  userId = Number(localStorage.getItem('userId'));

  constructor(

    private adminService: AdminService,

    private snack: MatSnackBar,

    private router: Router

  ) {}

  ngOnInit(): void {}

  /** ✅ Load all exams assigned to current admin */

  loadAssignedExams(): void {

    this.loading = true;

    this.adminService.getAssignedExams(this.userId).subscribe({

      next: (res) => {

        this.loading = false;

        if (res?.ExamList?.length > 0) {

          this.exams = res.ExamList;

        } else {

          this.snack.open('No exams assigned for review', 'Close', {

            duration: 3000,

          });

          this.exams = [];

        }

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.snack.open('Failed to load exams', 'Close', { duration: 3000 });

      },

    });

  }

  /** ✅ Open selected exam for detailed review */

  openExam(exam: AdminExam): void {

    this.router.navigate(['/admin/dashboard/review-exam'], { state: { exam } });

  }

}
 