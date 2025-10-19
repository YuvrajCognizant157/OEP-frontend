import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-reported-questions',
  standalone:true,
  imports:[CommonModule],

  templateUrl: './reported-questions.html',

  styleUrls: ['./reported-questions.css']

})

export class ReportedQuestionsComponent implements OnInit {

  questions: any[] = [];

  message = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {

    this.loadQuestions();

  }

  loadQuestions(): void {

    this.adminService.getReportedQuestions().subscribe({

      next: (res: any) => {

        if (typeof res === 'string') {

          this.message = res;

          this.questions = [];

        } else {

          this.questions = res;

          if (!this.questions.length) {

            this.message = 'No reported questions found.';

          } else {

            this.message = '';

          }

        }

      },

      error: () => {

        this.message = 'Error loading reported questions.';

      }

    });

  }

  viewQuestion(qid: number): void {

    this.router.navigate(['/admin/review-question', qid]);

  }

}
 