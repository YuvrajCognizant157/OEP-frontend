import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core'; // Import OnDestroy
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs'; // Import Subscription and timer
import { switchMap } from 'rxjs/operators'; // Import switchMap

import { MatCardModule, MatCardHeader } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TopicDialog } from './topic-dialog/topic-dialog';
import { TopicsService } from '../../core/services/topics.service';
import { AuthService } from '../../core/services/auth.service';

// --- Interfaces (from your code) ---
interface Topic {
  tid: number;
  subject: string;
  approvalStatus: number;
  submittedForApproval: boolean;
}

export interface TopicResponse {
  message: string;
  topicStatus: number;
}

@Component({
  selector: 'app-manage-topic',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardHeader,
    MatCardModule,
  ],
  templateUrl: './manage-topic.html',
  styleUrl: './manage-topic.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTopic implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  topics = signal<Topic[]>([]);
  isLoading = signal(true);
  examinerId!: number;

  // This will hold our polling subscription so we can clean it up later
  private topicsPollingSubscription!: Subscription;

  constructor(private topicsService: TopicsService) {}

  ngOnInit() {
    this.examinerId = this.authService.getUserRole()?.id!;
    this.startPollingForTopics();
  }

  /**
   * This method starts the polling process.
   * It makes an API call immediately and then every 10 seconds thereafter.
   */
  startPollingForTopics() {
    this.topicsPollingSubscription = timer(0, 50000) // Emits at 0ms, then every 50,000ms
      .pipe(
        // switchMap cancels the previous pending request if a new one comes in
        switchMap(() => {
          this.isLoading.set(true);
          return this.topicsService.getYourTopics(this.examinerId);
        })
      )
      .subscribe({
        next: (response: Topic[]) => {
          this.topics.set(response); // Set the topics with the real data
          this.isLoading.set(false);
          console.log('Topics refreshed successfully.');
        },
        error: (err) => {
          console.error('Error while polling for topics:', err);
          this.isLoading.set(false); // Stop loading indicator on error
        },
      });
  }

  /**
   * This lifecycle hook is crucial. It runs when the component is destroyed.
   * We unsubscribe here to prevent memory leaks from the polling. 🧠
   */
  ngOnDestroy() {
    if (this.topicsPollingSubscription) {
      this.topicsPollingSubscription.unsubscribe();
    }
  }

  getApprovalStatus(status: number, approval: boolean): { text: string; class: string } {
    if (status === 1) return { text: 'Approved', class: 'status-approved' };
    if (status === 0 && approval === true)
      return { text: 'Submitted For Approval', class: 'status-awaited' };
    if (status === 0) return { text: 'Pending', class: 'status-pending' };
    return { text: 'Rejected', class: 'status-rejected' };
  }

  openTopicDialog(isEdit: boolean, topic?: Topic): void {
    const dialogRef = this.dialog.open(TopicDialog, {
      width: '450px',
      data: { isEdit, topic },
      panelClass: 'themed-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (isEdit && topic) {
          this.updateTopic(topic.tid, result.name);
        } else {
          this.createTopic(result.name);
        }
      }
    });
  }

  createTopic(topicName: string) {
    this.topicsService.createTopicService(topicName, this.examinerId).subscribe({
      next: (response: TopicResponse) => {
        if (response.topicStatus >= 1) {
          this.startPollingForTopics();
        }
        alert(response.message);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateTopic(tid: number, topicName: string) {
    this.topicsService.updateTopicService(topicName, tid).subscribe({
      next: (response: TopicResponse) => {
        alert(response.message);
        // Optimistically update the local data for immediate UI feedback
        this.topics.update((currentTopics) =>
          currentTopics.map((t) =>
            t.tid === tid ? { ...t, subject: topicName } : t
          )
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteTopic(topicId: number) {
    this.topicsService.deleteTopicService(topicId).subscribe({
      next: (response: TopicResponse) => {
        alert(response.message);
        // Optimistically update the local data for immediate UI feedback
        this.topics.update((currentTopics) => currentTopics.filter((t) => t.tid !== topicId));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  sendForApproval(topicId: number) {
    this.topicsService.sendTopicForApproval(topicId).subscribe({
      next: (response: TopicResponse) => {
        alert(response.message);
        
        this.topics.update((currentTopics) =>
          currentTopics.map((t) =>
            t.tid === topicId
              ? { ...t, approvalStatus: 0, submittedForApproval: true }
              : t
          )
        );
      },
      error: (err) => {
        console.error('Failed to send topic for approval:', err);
        alert('An error occurred while submitting the topic. Please try again.');
      },
    });
  }

  isTopicLocked(topic: Topic): boolean {
    const isApproved = topic.approvalStatus === 1;
    const isSubmitted = topic.approvalStatus === 0 && topic.submittedForApproval === true;
    return isApproved || isSubmitted;
  }
}
