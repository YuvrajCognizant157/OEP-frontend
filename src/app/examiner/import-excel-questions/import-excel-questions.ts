import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../core/services/question.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-excel-questions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // Add this
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './import-excel-questions.html',
  styleUrls: ['./import-excel-questions.css']
})
export class ImportExcelQuestions implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  maxFileSize = 50 * 1024 * 1024; // 50 MB
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      // tid: [null, [Validators.required, Validators.min(1)]],
      eid: [null], // optional
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;
    if (!file) return;

    if (file.size > this.maxFileSize) {
      this.snackBar.open('File size exceeds 50 MB limit.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      this.resetFileInput();
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
      this.snackBar.open('Only Excel files (.xlsx or .xls) are allowed.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      this.resetFileInput();
      return;
    }

    this.selectedFile = file;
    this.uploadForm.patchValue({ file: file });
  }

  private resetFileInput(): void {
    this.selectedFile = null;
    this.uploadForm.patchValue({ file: null });
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.snackBar.open('Please fill all required fields and select a valid file.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }

    this.isUploading = true;

    this.questionService.uploadQuestionsExcel(this.selectedFile, this.uploadForm.value.eid).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.snackBar.open('Questions imported successfully!', 'Close', { duration: 5000, panelClass: ['success-snackbar'] });
        this.resetForm();
      },
      error: (error) => {
        this.isUploading = false;
        let errorMessage = 'Failed to import questions.';
        if (error?.status === 400) {
          errorMessage = error?.error?.message || errorMessage;
        } else if (error?.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  private resetForm(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}

