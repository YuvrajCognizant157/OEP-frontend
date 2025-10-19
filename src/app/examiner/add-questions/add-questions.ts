import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TopicsService } from '../../core/services/topics.service';

@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule
  ],
  templateUrl: './add-questions.html',
  styleUrl: './add-questions.css'
})
export class AddQuestions implements OnInit {

  topics: any[] = [];
  selectedMode: 'single' | 'multiple' = 'single';
  mode:string='single';
  singleQuestionForm!: FormGroup;
  multipleQuestionForm!: FormGroup;

  questionTypes = [
    { value: 'MCQ', viewValue: 'MCQ (Single Correct)' },
    { value: 'MSQ', viewValue: 'MSQ (Multiple Correct)' }
  ];

  constructor(private fb: FormBuilder, private topicsService: TopicsService) {}

  ngOnInit(): void {
    this.initializeForms();
    this.fetchTopics();
  }

  initializeForms(): void {
    this.singleQuestionForm = this.fb.group({
      tid: ['', Validators.required],
      type: ['MCQ', Validators.required],
      question: ['', Validators.required],
      options: ['', Validators.required],
      correctOptions: ['', Validators.required]
    });

    this.multipleQuestionForm = this.fb.group({
      tid: ['', Validators.required],
      questions: this.fb.array([this.createQuestionGroup()])
    });
  }

  get questionsArray(): FormArray {
    return this.multipleQuestionForm.get('questions') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      type: ['MCQ', Validators.required],
      question: ['', Validators.required],
      options: ['', Validators.required],
      correctOptions: ['', Validators.required]
    });
  }

  addNewQuestion(): void {
    this.questionsArray.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questionsArray.removeAt(index);
  }

  fetchTopics(): void {
    this.topicsService.getTopics().subscribe({
      next: (res) => {
        console.log('Fetched topics:', res);
        
        this.topics = res;
      },
      error: (err) => console.error('Error fetching topics:', err)
    });
  }

  submitSingleQuestion(): void {
    if (this.singleQuestionForm.valid) {
      const payload = {
        ...this.singleQuestionForm.value,
        correctOptions: [this.singleQuestionForm.value.correctOptions],
        approvalStatus: 1
      };
      console.log('Single Question Payload:', payload);
      // TODO: Call your API service to post this data
    }
  }

  submitMultipleQuestions(): void {
    if (this.multipleQuestionForm.valid) {
      const payload = {
        tid: this.multipleQuestionForm.value.tid,
        questions: this.multipleQuestionForm.value.questions.map((q: any) => ({
          ...q,
          correctOptions: [q.correctOptions],
          approvalStatus: 1
        }))
      };
      console.log('Multiple Questions Payload:', payload);
      // TODO: Call your API service to post this data
    }
  }
}
