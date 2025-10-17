import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExaminerService } from '../../core/services/examiner.service';
import { TopicsService } from '../../core/services/topics.service';
import { Router } from '@angular/router';
import { AuthService, userDetails } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-exam',
  imports: [CommonModule, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.css'
})
export class CreateExam implements OnInit {
  examForm!: FormGroup;
  topics: any[] = [];
  userId = -1;

  constructor(
    private fb: FormBuilder,
    private examinerService: ExaminerService,
    private topicService: TopicsService,
    private authService: AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
    let tokenDetails: userDetails = this.authService.getUserRole()!;
    this.userId = tokenDetails?.id;
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      totalQuestions: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(0.5)]],
      tids: [[]],
      displayedQuestions: [null],
      marksPerQuestion: [null, [Validators.required, Validators.min(1)]],
    });

    this.getTopics();
  }

  getTopics() {
    this.topicService.getTopics().subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (err) => {
        console.error('Error fetching topics:', err);
      },
    });
  }
  onTopicChange(event: MatCheckboxChange, topicId: number) {
    const tids = (this.examForm.get('tids')?.value as number[]) || [];

    if (event.checked) {
      tids.push(topicId);
    } else {
      const index = tids.indexOf(topicId);
      if (index > -1) {
        tids.splice(index, 1);
      }
    }
    this.examForm.get('tids')?.setValue(tids);
  }

  addQuestions(): void {
    if (this.examForm.valid) {
      const formValue = this.examForm.value;
      const examData = {
        ...formValue,
        userId: this.userId
      };

      this.examinerService.addExam(examData).subscribe({
        next:(response) => {
          console.log('Exam metadata saved. You can now add questions:', response);
          alert('Exam metadata saved successfully.');
          
          this.router.navigate(['/examiner/dashboard/add-questions'], { queryParams: { examId: response.examId } });
        },
        error:(error) => {
          console.error('Failed to create exam:', error);
          alert('Failed to create exam. Please try again.');
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
