import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';


import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';

import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../../core/services/admin.service';

@Component({

  selector: 'app-approve-topic',

  standalone: true,

  imports: [CommonModule, FormsModule, MatSnackBarModule, MatButtonModule, MatTableModule, MatCardModule],

  templateUrl: './approve-topic.html',

  styleUrls: ['./approve-topic.css']

})

export class ApproveTopicComponent implements OnInit {

  topics: any[] = [];

  userId!: number;

  loading = false;

  displayedColumns: string[] = ['id', 'subject', 'actions'];

  constructor(

    private adminService: AdminService,

    private snack: MatSnackBar,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    const storedId = localStorage.getItem('userId');

    if (storedId) {

      this.userId = Number(storedId);

      console.log('Admin ID from localStorage:', this.userId);

    } else {

      this.snack.open('Admin ID missing! Please log in again.', 'close', { duration: 3000 });

      return;

    }

  }

  loadTopics(): void {

    if (!this.userId) {

      this.snack.open('Admin ID missing! Please log in again.', 'close', { duration: 3000 });

      return;

    }

    this.loading = true;

    this.adminService.getTopicsForApproval(this.userId).subscribe({

      next: (res: any) => {

        console.log('Response from backend:', res);

        this.topics = res?.topics || [];

        console.log('Topics assigned to UI:', this.topics);

        if (this.topics.length === 0) {

          this.snack.open('No topics available for approval.', 'close', { duration: 3000 });

        }

        this.loading = false;

        this.cdr.detectChanges(); // force UI refresh

      },

      error: (err) => {

        this.loading = false;

        console.error('Error loading topics:', err);

        this.snack.open('Error loading topics.', 'close', { duration: 3000 });

      }

    });

  }

  approveTopic(topicId: number): void {

    if (!this.userId) return;

    this.adminService.approveOrRejectTopic(topicId, this.userId).subscribe({

      next: () => {

        this.snack.open('Topic approved successfully!', 'close', { duration: 2000 });

        this.loadTopics(); // reload list

      },

      error: (err) => {

        this.snack.open('Error while approving topic.', 'close', { duration: 3000 });

        console.error('Error approving topic:', err);

      }

    });

  }

  rejectTopic(topicId: number): void {

    this.snack.open('Reject logic not implemented yet.', 'close', { duration: 3000 });

  }

}
 