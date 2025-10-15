import { Component,inject, signal, OnInit, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MatCardModule, MatCardHeader } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { TopicDialog } from './topic-dialog/topic-dialog';
interface Topic {
  tid: number;
  subject: string;
  approvalStatus: number;
}
@Component({
  selector: 'app-manage-topic',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCardHeader, MatCardModule],
  templateUrl: './manage-topic.html',
  styleUrl: './manage-topic.css'
})
export class ManageTopic {
  
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  topics = signal<Topic[]>([]);
  isLoading = signal(true);

  // --- MOCK DATA ---
  private mockTopics: Topic[] = [
      { tid: 1, subject: 'Angular Core Concepts', approvalStatus: 1 },
      { tid: 2, subject: 'Advanced TypeScript', approvalStatus: 0 },
      { tid: 3, subject: 'C# Design Patterns', approvalStatus: -1 },
  ];

  ngOnInit() {
    this.fetchTopics();
  }

  fetchTopics() {
    this.isLoading.set(true);
    // In a real app, you would make an HTTP GET request here.
    // For now, we'll use mock data.
    setTimeout(() => {
        this.topics.set(this.mockTopics);
        this.isLoading.set(false);
    }, 1000);
  }

  getApprovalStatus(status: number): { text: string; class: string } {
    if (status === 1) return { text: 'Approved', class: 'status-approved' };
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEdit && topic) {
          // --- UPDATE LOGIC ---
          this.updateTopic(topic.tid, result.name);
        } else {
          // --- CREATE LOGIC ---
          this.createTopic(result.name);
        }
      }
    });
  }

  createTopic(topicName: string) {
    // API URL from your backend
    const apiUrl = `/api/topics/add-topic?TopicName=${encodeURIComponent(topicName)}`;
    console.log(`Calling CREATE API: ${apiUrl}`);
    // this.http.post(apiUrl, {}).subscribe(...)
    
    // MOCK: Add to local list
    const newTopic: Topic = { tid: Math.floor(Math.random() * 1000), subject: topicName, approvalStatus: 0 };
    this.topics.update(currentTopics => [...currentTopics, newTopic]);
  }

  updateTopic(tid: number, topicName: string) {
    // API URL from your backend
    const apiUrl = `/api/topics/update-topic/${tid}`;
    const payload = { Name: topicName };
     console.log(`Calling UPDATE API: ${apiUrl} with payload`, payload);
    // this.http.post(apiUrl, payload).subscribe(...)
    
    // MOCK: Update local list
    this.topics.update(currentTopics => 
        currentTopics.map(t => t.tid === tid ? { ...t, subject: topicName } : t)
    );
  }

  deleteTopic(topicId: number) {
    // For now, we'll just log and mock the deletion
    console.log(`Attempting to delete topic ID: ${topicId}`);
    // API URL from your backend
    const apiUrl = `/api/topics/delete-topic/${topicId}`;
    
    // MOCK: Remove from local list
    this.topics.update(currentTopics => currentTopics.filter(t => t.tid !== topicId));
    // In a real app, you'd show a confirmation dialog first
    // and then make the HTTP POST request on confirmation.
  }
}
