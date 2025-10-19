import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-review-question',
  standalone:true,
  imports:[CommonModule,RouterLink,RouterLinkActive,RouterModule],

  templateUrl: './review-question.html',

  styleUrls: ['./review-question.css']

})

export class ReviewQuestionComponent implements OnInit {

  qid!: number;

  question: any;

  message = '';

  constructor(

    private route: ActivatedRoute,

    private adminService: AdminService,

    public router: Router

  ) {}

  ngOnInit() {

    this.qid = +this.route.snapshot.paramMap.get('qid')!;

    this.loadQuestion();

  }

  loadQuestion() {

    this.adminService.getReportedQuestionById(this.qid).subscribe((res: any) => {

      if (typeof res === 'string') {

        this.message = res;

      } else {

        this.question = res;

      }

    });

  }

  review(status: number) {

    const dto = { qid: this.qid, status };

    this.adminService.reviewReportedQuestion(dto).subscribe((res: any) => {

      this.message = res;

      setTimeout(() => this.router.navigate(['/admin/reported-questions']), 1000);

    });

  }

}
 