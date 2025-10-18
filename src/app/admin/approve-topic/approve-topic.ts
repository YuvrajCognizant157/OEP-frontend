import { Component } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApproveTopic } from '../../shared/models/approve-topic.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-approve-topic',
imports: [MatFormFieldModule,

MatInputModule,

MatButtonModule,

MatSnackBarModule,

MatProgressSpinnerModule,

MatTableModule,

CommonModule,

FormsModule
 ],

  templateUrl: './approve-topic.html',

  styleUrls: ['./approve-topic.css']

})

export class ApproveTopicComponent {

  adminId: number | null = null;

  topics: ApproveTopic[] = [];

  displayedColumns = ['id', 'topicName', 'actions'];

  loading = false;

  constructor(private adminService: AdminService, private snack: MatSnackBar) {}

  loadTopics() {

    if (!this.adminId) {

      this.snack.open('Please enter Admin ID', 'OK', { duration: 2000 });

      return;

    }

    this.loading = true;

    this.adminService.getTopicsForApproval(this.adminId).subscribe({

      next: (res) => {

        this.topics = res;

        this.loading = false;

        if (this.topics.length === 0) {

          this.snack.open('No topics found for this admin.', 'OK', { duration: 2000 });

        }

      },

      error: (err) => {

        this.loading = false;

        this.snack.open('Error loading topics.', 'OK', { duration: 2000 });

        console.error(err);

      }

    });

  }

  approve(topicId: number) {

    if (!this.adminId) return;

    this.adminService.approveOrRejectTopic(topicId, this.adminId).subscribe({

      next: () => {

        this.snack.open('Topic approved successfully!', 'OK', { duration: 2000 });

        this.loadTopics();

      },

      error: (err) => {

        this.snack.open('Error approving topic.', 'OK', { duration: 2000 });

        console.error(err);

      }

    });

  }

  reject(topicId: number) {

    if (!this.adminId) return;

    this.adminService.approveOrRejectTopic(topicId, this.adminId).subscribe({

      next: () => {

        this.snack.open('Topic rejected successfully!', 'OK', { duration: 2000 });

        this.loadTopics();

      },

      error: (err) => {

        this.snack.open('Error rejecting topic.', 'OK', { duration: 2000 });

        console.error(err);

      }

    });

  }

}
 