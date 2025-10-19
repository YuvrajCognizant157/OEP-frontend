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
    MatButtonToggleModule,
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
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = Number(params.get('examId'));
    });
    this.userId = this.authS.getUserId()!;
    console.log(this.examId);
    this.initializeForms();
    this.fetchTopics();
  }

  initializeForms(): void {
    this.singleQuestionForm = this.fb.group({
      tid: ['', Validators.required],
      type: ['MCQ', Validators.required],
      question: ['', Validators.required],
      options: ['', Validators.required],
      correctOptions: ['', Validators.required],
    });

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
      options: ['', Validators.required],
      correctOptions: ['', Validators.required],
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
      error: (err) => console.error('Error fetching topics:', err),
    });
  }

  submitSingleQuestion(): void {
    if (this.singleQuestionForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
    const formValue = this.singleQuestionForm.value;

    const optionsArray = formValue.options.split(',').map((s: string) => s.trim());
    const correctOptionsArray = formValue.correctOptions.split(',').map((s: string) => s.trim());

    const optionsObject: { [key: string]: string } = {};
    optionsArray.forEach((option: string, index: number) => {
      optionsObject[(index + 1).toString()] = option;
    });

    const correctOptionKeys = correctOptionsArray
      .map((correctOpt: any) => {
        const key = Object.keys(optionsObject).find(
          (k) => optionsObject[k].toLowerCase() === correctOpt.toLowerCase()
        );
        return key || null;
      })
      .filter((key: string | null): key is string => key !== null);

    const payload = {
      ...formValue,
      options: JSON.stringify(optionsObject),
      correctOptions: correctOptionKeys,
      approvalStatus: 1,
    };
    console.log('Single Question Payload:', payload);

    this.questionService.addSingleQuestion(payload, this.examId, this.userId).subscribe({
      next: (response) => {
        alert(response); // e.g., "Question added successfully"
        this.singleQuestionForm.reset();
        this.singleQuestionForm.patchValue({ type: 'MCQ' }); // Reset type to default
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
        // --- NEW TRANSFORMATION LOGIC (repeated for each question) ---
        const optionsArray = q.options.split(',').map((s: string) => s.trim());
        const correctOptionsArray = q.correctOptions.split(',').map((s: string) => s.trim());

        const optionsObject: { [key: string]: string } = {};
        optionsArray.forEach((option: string, index: number) => {
          optionsObject[(index + 1).toString()] = option;
        });

        const correctOptionKeys = correctOptionsArray
          .map((correctOpt: string) => {
            const key = Object.keys(optionsObject).find(
              (k) => optionsObject[k].toLowerCase() === correctOpt.toLowerCase()
            );
            return key || null;
          })
          .filter((key: string | null): key is string => key !== null);
        // --- END NEW LOGIC ---

        return {
          Type: q.type,
          Question: q.question,
          Options: JSON.stringify(optionsObject), // Format to JSON string
          CorrectOptions: correctOptionKeys, // Send the numeric keys
          ApprovalStatus: 1,
        };
      }),
    };
    console.log('Multiple Questions Payload:', payload," checking if examid: ",this.examId);

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
