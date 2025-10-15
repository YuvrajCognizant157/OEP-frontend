import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService } from '../../core/services/topics.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TopicDialog } from './topic-dialog/topic-dialog'; 

@Component({
  selector: 'app-topics',
  imports: [CommonModule,MatListModule,MatProgressBarModule,MatDialogModule,
    TopicDialog],
  templateUrl: './topics.html',
  styleUrl: './topics.css'
})
export class Topics implements OnInit {
  topics: {
    tid:string;
    subject:string;
  }[] = [];

  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private topicService: TopicsService
  ) { }

  ngOnInit(): void {
    this.topicService.getTopics().subscribe({
      next:(data) => {
        this.topics = data;
      },
      error:(error) => {
        console.error('Error fetching topics:', error);
      }
    });
  }

  openTopicDetails(topicId: string): void {
    let topicIdNum = Number(topicId);
    this.topicService.getTopicById(topicIdNum).subscribe({
      next: (topicData) => {
        if (topicData) {
          
          this.dialog.open(TopicDialog, {
            width: '500px', 
            data: topicData // Pass the fetched data to the dialog
          });
        } else {
          console.error('Topic not found');
        }
      },
      error: (err) => console.error('Failed to fetch topic details:', err)
    });
  }
}