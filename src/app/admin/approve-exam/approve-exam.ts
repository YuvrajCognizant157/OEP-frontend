import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Exam {

  eid: number;

  title: string;

  subject: string;

  createdBy: string;

  submittedOn: string;

}

interface ExamApprovalStatusDTO {

  eid: number;

  action: string;

  userId: number;

}

@Component({

  selector: 'app-approve-exam',

  standalone: true,

  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],

  templateUrl: './approve-exam.html',

  styleUrls: ['./approve-exam.css']

})

export class ApproveExam implements OnInit {

  exams: Exam[] = [];

  displayedColumns = ['eid', 'title', 'subject', 'createdBy', 'submittedOn', 'actions'];

  private apiBaseUrl = 'https://localhost:7200/api/admin';

  private loggedInUserId = 1; // 🔹 Replace this with real userId from your login/session token

  constructor(private http: HttpClient, private snack: MatSnackBar) {}

  ngOnInit(): void {

    this.fetchExams();

  }

  fetchExams() {

    this.http.get<Exam[]>(`${this.apiBaseUrl}/exams-to-approve`).subscribe({

      next: (data) => (this.exams = data),

      error: (err) => {

        console.error(err);

        this.snack.open('Failed to load exams.', 'Close', { duration: 3000 });

      }

    });

  }

  handleExamAction(eid: number, action: 'approve' | 'reject') {

    const dto: ExamApprovalStatusDTO = {

      eid,

      action,

      userId: this.loggedInUserId

    };

    this.http.post(`${this.apiBaseUrl}/approve-exam`, dto).subscribe({

      next: () => {

        this.snack.open(`Exam ${eid} ${action}d successfully.`, 'Close', { duration: 2000 });

        this.exams = this.exams.filter(e => e.eid !== eid);

      },

      error: () => {

        this.snack.open(`Failed to ${action} exam.`, 'Close', { duration: 2000 });

      }

    });

  }

}
 