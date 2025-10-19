import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';


@Component({

  selector: 'app-review-question',

 standalone:true,
  imports:[CommonModule],
  templateUrl: './review-question.html',

  styleUrls: ['./review-question.css']

})

export class ReviewQuestionComponent implements OnInit {

  qid!: number;

  question: any;

  message: string = '';

  loading: boolean = false;

  constructor(

    private route: ActivatedRoute,

    private adminService: AdminService,

    public router: Router

  ) {}

  ngOnInit(): void {

    this.qid = Number(this.route.snapshot.paramMap.get('qid'));

    this.loadQuestion();

  }

  loadQuestion(): void {

    this.loading = true;

    this.adminService.getReportedQuestionById(this.qid).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (typeof res === 'string') {

          this.message = 'No reported question found for review.';

          this.question = null;

        } else {

          this.question = res;

          this.message = '';

        }

      },

      error: () => {

        this.loading = false;

        this.message = 'Error loading question.';

      }

    });

  }

  review(status: number): void {

    this.loading = true;

    this.adminService.reviewReportedQuestion(this.qid, status).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.message = res;

        setTimeout(() => this.router.navigate(['/admin/reported-questions']), 1000);

      },

      error: () => {

        this.loading = false;

        this.message = 'Error updating question status.';

      }

    });

  }

}
 