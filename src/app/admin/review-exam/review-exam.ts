import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '../../core/services/admin.service';

import { AdminExam } from '../../shared/models/admin-exam.model';

import { AdminQuestion } from '../../shared/models/admin-question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-review-exam',
  standalone:true,
imports:[CommonModule,FormsModule],

  templateUrl: './review-exam.html',

  styleUrls: ['./review-exam.css'],

})

export class ReviewExamComponent implements OnInit {

  exam!: AdminExam;

  questions: AdminQuestion[] = [];

  currentIndex = 0;

  userId = Number(localStorage.getItem('userId'));

  constructor(

    private router: Router,

    private snack: MatSnackBar,

    private adminService: AdminService

  ) {}

  ngOnInit(): void {

    const nav = history.state;

    if (nav.exam) {

      this.exam = nav.exam;

      this.questions = this.exam.questions.map((q: AdminQuestion) => {
      try {
   if (typeof q.options === 'string') {
     q.options = JSON.parse(q.options);
   }
     } catch {
   q.options = {};
    }
 return q;
});

    } else {

      this.snack.open('No exam data found', 'Close', { duration: 3000 });

      this.router.navigate(['/admin/dashboard/approve-exam']);

    }

  }

  next(): void {

    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;

  }

  previous(): void {

    if (this.currentIndex > 0) this.currentIndex--;

  }

  approveOrReject(action: string): void {

    this.adminService

      .approveOrRejectExam(this.exam.eid, this.userId, action)

      .subscribe({

        next: (res) => {

          const msg = res?.message || `Exam ${action}ed successfully.`;

          this.snack.open(msg, 'Close', { duration: 3000 });

          this.router.navigate(['/admin/dashboard/approve-exam']);

        },

        error: (err) => {

          console.error(err);

          this.snack.open(`Failed to ${action} exam`, 'Close', {

            duration: 3000,

          });

        },

      });

  }

}
 