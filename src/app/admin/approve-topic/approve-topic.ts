import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-approve-topic',
  standalone:true,
  imports:[CommonModule],

  templateUrl: './approve-topic.html',

  styleUrls: ['./approve-topic.css']

})

export class ApproveTopicComponent implements OnInit {

  topics: any[] = [];

  loading = false;

  message = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {this.loadTopics();}

  loadTopics(): void {

    const userId = localStorage.getItem('userId');

    if (!userId) {

      this.message = 'Admin not logged in.';

      return;

    }

    this.loading = true;

    this.adminService.getTopicsForApproval(Number(userId)).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (typeof res === 'string' || res.message) {

          this.message = res.message || res;

          this.topics = [];

        } else {

          this.topics = res.topics || res;

          this.message = this.topics.length > 0 ? '' : 'No topics pending approval.';

        }

      },

      error: () => {

        this.loading = false;

        this.message = 'Error loading topics.';

      }

    });

  }

  approveTopic(topicId: number): void {

    this.updateTopicStatus(topicId, 'approve');

  }

  rejectTopic(topicId: number): void {

    this.updateTopicStatus(topicId, 'reject');

  }

  private updateTopicStatus(topicId: number, action: string): void {

    const userId = localStorage.getItem('userId');

    if (!userId) {

      this.message = 'Admin not logged in.';

      return;

    }

    this.loading = true;

    this.adminService.approveOrRejectTopic(topicId, Number(userId), action).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.message = res.message || `Topic ${action}d successfully.`;

        this.loadTopics();

      },

      error: () => {

        this.loading = false;

        this.message = 'Error updating topic status.';

      }

    });

  }

}
 