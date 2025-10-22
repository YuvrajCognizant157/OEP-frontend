import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({

  selector: 'app-review-exam',

  standalone: true,

  imports: [CommonModule, MatSnackBarModule],

  templateUrl: './review-exam.html',

  styleUrls: ['./review-exam.css']

})

export class ReviewExamComponent implements OnInit {

  examId!: number;

  userId!: number;

  examName = '';

  questions: any[] = [];

  currentIndex = 0;

  constructor(

    private route: ActivatedRoute,

    private adminService: AdminService,

    private snack: MatSnackBar,

    private router: Router

  ) {}

  ngOnInit(): void {

    // ✅ get examId from URL and userId from localStorage

    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.userId = Number(localStorage.getItem('userId'));

    this.loadExamQuestions();

  }

  /** ✅ Load exam questions from API */

  loadExamQuestions(): void {

    this.adminService.getExamQuestions(this.examId).subscribe({

      next: (res: any) => {

        console.log('✅ Raw API Response:', res);

        this.examName = res.name || res.examName || 'Exam';

        const rawQuestions = res.questions || [];

        this.questions = rawQuestions.map((q: any, i: number) => {

          let optionsArray: string[] = [];

          try {

            // ✅ Parse options (backend sends JSON string or object)

            if (typeof q.options === 'string') {

              const parsed = JSON.parse(q.options);

              optionsArray = Object.values(parsed);

            } else if (typeof q.options === 'object') {

              optionsArray = Object.values(q.options);

            }

          } catch (err) {

            console.error('❌ Error parsing options for QID:', q.qid, err);

          }

          // ✅ Parse correct options safely

          let correctOptions: string[] = [];

          try {

            if (typeof q.correctOptions === 'string') {

              const parsed = JSON.parse(q.correctOptions);

              correctOptions = Array.isArray(parsed)

                ? parsed

                : Object.values(parsed);

            } else if (typeof q.correctOptions === 'object') {

              correctOptions = Object.values(q.correctOptions);

            }

          } catch {}

          return {

            number: i + 1,

            qid: q.qid,

            // ✅ FIXED: question1 or question key support

            question: q.question1 || q.question || 'Untitled Question',

            options: optionsArray,

            correctOptions: correctOptions,

            marks: q.marks

          };

        });

        console.log('✅ Parsed questions:', this.questions);

        if (!this.questions.length) {

          this.snack.open('No questions found for this exam', 'Close', {

            duration: 3000

          });

        }

      },

      error: (err) => {

        console.error('❌ API Error:', err);

        this.snack.open('Error loading questions', 'Close', { duration: 3000 });

      }

    });

  }

  /** ✅ Navigation */

  nextQuestion(): void {

    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;

  }

  prevQuestion(): void {

    if (this.currentIndex > 0) this.currentIndex--;

  }

  /** ✅ Approve Exam */

  approveExam(): void {

    this.adminService

      .approveOrRejectExam(this.examId, this.userId, 'approve')

      .subscribe(() => {

        this.snack.open('✅ Exam Approved', 'Close', { duration: 3000 });

        this.router.navigate(['/admin/dashboard/approve-exam']);

      });

  }

  /** ✅ Reject Exam */

  rejectExam(): void {

    this.adminService

      .approveOrRejectExam(this.examId, this.userId, 'reject')

      .subscribe(() => {

        this.snack.open('❌ Exam Rejected', 'Close', { duration: 3000 });

        this.router.navigate(['/admin/dashboard/approve-exam']);

      });

  }

}
 