import { Component, OnInit } from '@angular/core';
import { ExaminerService } from '../../core/services/examiner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topics',
  imports: [CommonModule],
  templateUrl: './topics.html',
  styleUrl: './topics.css'
})
export class Topics implements OnInit {
  topics: any[] = [];

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    this.examinerService.getTopics().subscribe(
      data => {
        this.topics = data;
      },
      error => {
        console.error('Error fetching topics:', error);
      }
    );
  }
}