import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TopicsService } from '../../core/services/topics.service';
import { QuestionService } from '../../core/services/question.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


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
  styleUrl: './add-questions.css',
})
export class AddQuestions implements OnInit {
  topics: any[] = [];
  selectedMode: 'single' | 'multiple' = 'single';
  mode: string = 'single';
  singleQuestionForm!: FormGroup;
  multipleQuestionForm!: FormGroup;

  examId!: number;
  userId!: number;

  questionTypes = [
    { value: 'MCQ', viewValue: 'MCQ (Single Correct)' },
    { value: 'MSQ', viewValue: 'MSQ (Multiple Correct)' },
  ];

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private authS: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = Number(params.get('examId'));
    });
    this.userId = this.authS.getUserId()!;
    console.log(this.examId);
    this.initializeForms();
    this.fetchTopics(this.examId);
  }

  initializeForms(): void {
    // ✅ REPLACED: Single question form now has 4 separate option fields
    this.singleQuestionForm = this.fb.group({
      tid: ['', Validators.required],
      type: ['MCQ', Validators.required],
      question: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctOptions: ['', Validators.required], // single input, comma-separated
    });

    // ✅ REPLACED: Multiple question form question groups now have 4 option fields
    this.multipleQuestionForm = this.fb.group({
      tid: ['', Validators.required],
      questions: this.fb.array([this.createQuestionGroup()]),
    });
  }



  get questionsArray(): FormArray {
    return this.multipleQuestionForm.get('questions') as FormArray;
  }


  createQuestionGroup(): FormGroup {
    return this.fb.group({
      type: ['MCQ', Validators.required],
      question: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctOptions: ['', Validators.required], // single input, comma-separated
    });
  }


  addNewQuestion(): void {
    this.questionsArray.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questionsArray.removeAt(index);
  }

  fetchTopics(examId:number): void {
    this.topicsService.getExamTopics(examId).subscribe({
      next: (res) => {
        console.log('Fetched topics:', res);
        this.topics = res;
      },
      error: (err) => console.error('Error fetching topics:', err),
    });
  }

  submitSingleQuestion(): void {
    console.log('submitting single');

    if (this.singleQuestionForm.invalid) {
      console.log('All fields are required.');

      alert('Please fill out all required fields.');
      return;
    }
    const formValue = this.singleQuestionForm.value;

    // ✅ REPLACED: Options object from 4 separate fields
    const optionsObject: Record<string, string> = {
      '1': formValue.option1,
      '2': formValue.option2,
      '3': formValue.option3,
      '4': formValue.option4,
    };

    console.log('correct options array: ', formValue.correctOptionsArray);

    const correctOptionKeys = formValue.correctOptions
      .split(',')
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt !== '');

    const validKeys = ['1', '2', '3', '4'];

    // 2. Validate that EVERY key is a number between 1 and 4
    const isValid = correctOptionKeys.every((key: any) => validKeys.includes(key));

    if (!isValid) {
      alert('Invalid option number detected. Please enter option numbers (1, 2, 3, or 4) separated by commas.');
      return; // Stop submission
    }
    const payload = {
      ...formValue,
      options: JSON.stringify(optionsObject),
      correctOptions: correctOptionKeys,
      approvalStatus: 1,
    };
    console.log('Single Question Payload:', payload);

    this.questionService.addSingleQuestion(payload, this.examId, this.userId).subscribe({
      next: (response) => {
        alert(response);
        this.singleQuestionForm.reset();
        this.singleQuestionForm.patchValue({ type: 'MCQ' });
      },
      error: (err) => {
        console.error('Error adding question:', err);
        alert(`Failed to add question: ${err.error}`);
      },
    });
  }

  submitMultipleQuestions(): void {
    if (this.multipleQuestionForm.invalid) {
      alert('Please fill out all required fields for all questions.');
      return;
    }

    const formValue = this.multipleQuestionForm.value;

    const payload = {
      tid: formValue.tid,
      questions: formValue.questions.map((q: any) => {
        // ✅ REPLACED: Options object from 4 separate fields for each question
        const optionsObject: Record<string, string> = {
          '1': q.option1,
          '2': q.option2,
          '3': q.option3,
          '4': q.option4,
        };

        const correctOptionKeys = q.correctOptions
          .split(',')
          .map((opt: string) => opt.trim())
          .filter((opt: string) => opt !== '');

        const validKeys = ['1', '2', '3', '4'];

        // 2. Validate that EVERY key is a number between 1 and 4
        const isValid = correctOptionKeys.every((key: any) => validKeys.includes(key));

        if (!isValid) {
          alert('Invalid option number detected. Please enter option numbers (1, 2, 3, or 4) separated by commas.');
          return; // Stop submission
        }

        return {
          Type: q.type,
          Question: q.question,
          Options: JSON.stringify(optionsObject),
          CorrectOptions: correctOptionKeys,
          ApprovalStatus: 1,
        };
      }),
    };
    console.log('Multiple Questions Payload:', payload, 'checking examId:', this.examId);

    this.questionService.addMultipleQuestions(payload, this.examId, this.userId).subscribe({
      next: (response) => {
        alert(response);
        this.multipleQuestionForm.reset();
        this.questionsArray.clear();
        this.addNewQuestion();
      },
      error: (err) => {
        console.error('Error adding questions:', err);
        alert(`Failed to add questions: ${err.error}`);
      },
    });
  }
}