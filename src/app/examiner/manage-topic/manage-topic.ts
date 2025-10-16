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
import { TopicDialog } from './topic-dialog/topic-dialog';
import { TopicsService } from '../../core/services/topics.service';

interface Topic {
  tid: number;
  subject: string;
  approvalStatus: number;
}
interface CreateTopicResponse{
  Message :string; CreatedTopicStatus : number;
}
interface TopicResponse{
  Message :string, TopicStatus :number;
};

@Component({
  selector: 'app-manage-topic',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCardHeader, MatCardModule],
  templateUrl: './manage-topic.html',
  styleUrl: './manage-topic.css'
})
export class ManageTopic {
  
  private dialog = inject(MatDialog);

  topics = signal<Topic[]>([]);
  isLoading = signal(true);

  constructor(private topicsService:TopicsService){}

  private mockTopics: Topic[] = [
      { tid: 1, subject: 'Angular Core Concepts Sample', approvalStatus: 1 },
      { tid: 2, subject: 'Advanced TypeScript Sample', approvalStatus: 0 },
      { tid: 3, subject: 'C# Design Patterns Sample', approvalStatus: -1 },
  ];

  ngOnInit() {
    this.fetchTopics();
  }

  fetchTopics() {
    this.isLoading.set(true);
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
    
    this.topicsService.createTopicService(topicName).subscribe({
      next: (response:CreateTopicResponse) =>{
        alert(response.Message);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }

  updateTopic(tid: number, topicName: string) {
   
     this.topicsService.updateTopicService(topicName,tid).subscribe({
      next: (response:TopicResponse)=>{
        alert(response.Message);
      },
      error:(err)=>{
        console.error(err);
      }
     })
    
    // MOCK: Update local list
    this.topics.update(currentTopics => 
        currentTopics.map(t => t.tid === tid ? { ...t, subject: topicName } : t)
    );
  }

  deleteTopic(topicId: number) {
    this.topicsService.deleteTopicService(topicId).subscribe({
      next: (response:TopicResponse)=>{
        alert(response.Message);
      },
      error:(err)=>{
        console.error(err);
      }
    })
    this.topics.update(currentTopics => currentTopics.filter(t => t.tid !== topicId));
  }
}
