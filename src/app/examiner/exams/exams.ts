import { Component, OnInit } from '@angular/core';
import { ExaminerService } from '../../core/services/examiner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams',
  imports: [CommonModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams implements OnInit {
  exams: any[] = [];
  userId = 1; // Get this from a logged-in user's session

  constructor(private examinerService: ExaminerService) { }

  ngOnInit(): void {
    this.examinerService.getExamsForExaminer(this.userId).subscribe({
      next:(data )=> {
        this.exams = data;
      },
      error:(err) => {
        console.error('Error fetching exams:', err);
      }
    });
  }
}
