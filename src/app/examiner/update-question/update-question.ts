import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../core/services/question.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-update-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatProgressSpinner
  ],
  templateUrl: './update-question.html',
  styleUrl: './update-question.css',
})
export class UpdateQuestion implements OnInit {

  questionForm!: FormGroup;
  questionId!: number;
  originalData: any = {};
  isLoading = true;

  questionTypes = [
    { value: 'MCQ', viewValue: 'MCQ (Single Correct)' },
    { value: 'MSQ', viewValue: 'MSQ (Multiple Correct)' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private authS: AuthService
  ) { }

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('questionId'));
    this.initializeForm();
    this.loadQuestionData();
  }

  initializeForm(): void {
    this.questionForm = this.fb.group({
      type: ['', Validators.required],
      question: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctOptions: ['', Validators.required], // comma-separated
    });
  }

  loadQuestionData(): void {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.originalData = res;

        // 1. Parse the JSON string for options into a JavaScript object
        let parsedOptions: Record<string, string> = {};
        if (typeof res.options === 'string') {
          try {
            parsedOptions = JSON.parse(res.options);
          } catch (e) {
            console.error("Failed to parse options JSON string:", e);
          }
        } else if (res.options) {
          // Handle if the service already parsed it before reaching the component
          parsedOptions = res.options;
        }

        // 2. Parse the JSON string for correctOptions into a JavaScript array
        let correctOptionString = '';
        if (typeof res.correctOptions === 'string') {
          try {
            // Parse "[\"2\",\"4\"]" into the array ["2", "4"]
            const correctOptionsArray: string[] = JSON.parse(res.correctOptions);

            // Join the array into a comma-separated string for the form input: "2,4"
            correctOptionString = correctOptionsArray.join(',');

          } catch (e) {
            console.error("Failed to parse correctOptions JSON string:", e);
          }
        }

        this.questionForm.patchValue({
          type: res.type,
          question: res.question1, // Use question1 property from the response

          // Use the parsed options object to fill the individual fields
          option1: parsedOptions['1'] || '',
          option2: parsedOptions['2'] || '',
          option3: parsedOptions['3'] || '',
          option4: parsedOptions['4'] || '',

          // Use the comma-separated string for the correctOptions input
          correctOptions: correctOptionString,
        });
      },
      error: (err) => {
        console.error('Error loading question:', err);
        alert('Failed to load question details');
        this.router.navigate(['/examiner/dashboard/manage-questions']);
      },
    });
  }

  buildUpdatePayload(): any {
    const formValue = this.questionForm.value;
    const payload: any = {};
    const options: Record<string, string> = {
      '1': formValue.option1,
      '2': formValue.option2,
      '3': formValue.option3,
      '4': formValue.option4,
    };

    const correctOptionsArray =
      typeof formValue.correctOptions === 'string'
        ? formValue.correctOptions.split(',').map((s: string) => s.trim())
        : [];

    // Compare fields with originalData
    if (formValue.type !== this.originalData.type) payload.type = formValue.type;
    if (formValue.question !== this.originalData.question)
      payload.question = formValue.question;

    const originalOptions =
      typeof this.originalData.options === 'string'
        ? JSON.parse(this.originalData.options)
        : this.originalData.options;

    if (JSON.stringify(options) !== JSON.stringify(originalOptions))
      payload.options = JSON.stringify(options);

    const origCorrect =
      this.originalData.correctOptions || this.originalData.correct_options || [];
    if (JSON.stringify(correctOptionsArray) !== JSON.stringify(origCorrect))
      payload.correctOptions = correctOptionsArray;

    payload.approvalStatus = 1;
    return payload;
  }

  submitUpdatedQuestion(): void {
    const payload = this.buildUpdatePayload();
    if (Object.keys(payload).length <= 1) {
      alert('No changes made.');
      return;
    }

    this.questionService.updateQuestion(this.questionId, payload).subscribe({
      next: (res) => {
        alert('Question updated successfully!');
        this.router.navigate(['/examiner/dashboard/manage-questions']);
      },
      error: (err) => {
        console.error('Error updating question:', err);
        alert('Failed to update question.');
      },
    });
  }

  cancelUpdate(): void {
    this.router.navigate(['/examiner/dashboard/manage-questions']);
  }
}
