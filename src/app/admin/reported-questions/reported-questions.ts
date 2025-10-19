import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-reported-questions',
  standalone:true,
  imports:[CommonModule,FormsModule],

  templateUrl: './reported-questions.html',

  styleUrls: ['./reported-questions.css']

})

export class ReportedQuestionsComponent implements OnInit {

  questions: any[] = [];

  message: string = '';

  adminId: number = 0;

  loading: boolean = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('userId');

    if (storedUser) {

      const parsed = JSON.parse(storedUser);

      this.adminId = parsed.userId || 0;

      this.loadQuestions(); // auto load on open

    } else {

      this.message = 'Admin not logged in.';

    }

  }

  loadQuestions(): void {

    this.loading = true;

    this.adminService.getReportedQuestions(this.adminId).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (typeof res === 'string') {

          this.message = 'No reported questions for review.';

          this.questions = [];

        } else if (res.length === 0) {

          this.message = 'No reported questions for review.';

          this.questions = [];

        } else {

          this.questions = res;

          this.message = '';

        }

      },

      error: () => {

        this.loading = false;

        this.message = '⚠️ Error loading reported questions.';

      }

    });

  }

  viewQuestion(qid: number): void {

    this.router.navigate([`/admin/review-question/${qid}`]);

  }

}
 