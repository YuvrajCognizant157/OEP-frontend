import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-review-exam',

  standalone: true,

  imports:[CommonModule,MatSnackBarModule],

  templateUrl: './review-exam.html',

  styleUrls: ['./review-exam.css']

})

export class ReviewExamComponent implements OnInit {

  examId!: number;

  examName = '';

  questions: any[] = [];

  currentIndex = 0;

  userId!: number;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private snack: MatSnackBar, private router: Router) {}

  ngOnInit() {

    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.userId = Number(localStorage.getItem('userId'));

    this.loadExamQuestions();

  }

 loadExamQuestions(): void {

  this.adminService.getExamQuestions(this.examId).subscribe({

    next: (res: any) => {

      console.log('API Response:', res);

      this.questions = res.questions || [];

      this.examName = res.examName || 'Exam';

      // ✅ Fix: convert string options into arrays

      this.questions = this.questions.map((q: any) => {

        if (typeof q.options === 'string') {

          try {

            // remove brackets or quotes if stored as plain string

            q.options = q.options

              .replace(/[\[\]']+/g, '')

              .split(',')

              .map((opt: string) => opt.trim());

          } catch {

            q.options = [];

          }

        }

        return q;

      });

      if (!this.questions.length) {

        this.snack.open('No questions found for this exam', 'Close', { duration: 3000 });

      }

    },

    error: (err) => {

      console.error('Error loading questions:', err);

      this.snack.open('Error loading questions', 'Close', { duration: 3000 });

    }

  });

}
 
  nextQuestion() {

    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;

  }

  prevQuestion() {

    if (this.currentIndex > 0) this.currentIndex--;

  }

  approveExam() {

    this.adminService.approveOrRejectExam(this.examId, this.userId, 'approve').subscribe(() => {

      this.snack.open('Exam approved', 'Close', { duration: 3000 });

      this.router.navigate(['/admin/dashboard/approve-exam']);

    });

  }

  rejectExam() {

    this.adminService.approveOrRejectExam(this.examId, this.userId, 'reject').subscribe(() => {

      this.snack.open('Exam rejected', 'Close', { duration: 3000 });

      this.router.navigate(['/admin/dashboard/approve-exam']);

    });

  }

}
 