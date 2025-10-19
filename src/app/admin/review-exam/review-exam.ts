import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({

  selector: 'app-review-exam',

  standalone: true,

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

    this.examId = Number(this.route.snapshot.paramMap.get('id'));

    this.userId = Number(localStorage.getItem('userId'));

    this.loadExamQuestions();

  }

  loadExamQuestions() {

    this.adminService.getExamQuestions(this.examId).subscribe({

      next: (res) => {

        this.questions = res.questions;

        this.examName = res.name;

      },

      error: () => this.snack.open('Error loading questions', 'Close', { duration: 3000 })

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
 