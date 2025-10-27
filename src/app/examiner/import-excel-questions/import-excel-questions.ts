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
import { Exam } from '../exams/exams';
import { ExamService } from '../../core/services/exam.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSelectModule } from "@angular/material/select";
import { MatDialog } from '@angular/material/dialog';


// Assuming ImportResultDto looks like this in TypeScript
interface ImportResultDto {
  totalRows: number;
  inserted: number;
  errors: { rowNumber: number; message: string }[];
}


@Component({
  selector: 'app-import-excel-questions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add this
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule
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
  userId!: number;
  examsList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private snackBar: MatSnackBar,
    private examService: ExamService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.uploadForm = this.fb.group({
      // tid: [null, [Validators.required, Validators.min(1)]],
      eid: [null], // optional
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {

    this.userId = this.authService.getUserId()!;

    this.examService.getUnapprovedExams(this.userId).subscribe({
      next: (exams: Exam[]) => {
        console.log('Unapproved Exams:', exams);
        this.examsList = exams.map(({ eid, name }) => ({ eid, name }));
      }
    });
  }

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

    // 🔑 Cast the response type to the expected DTO
    this.questionService.uploadQuestionsExcel(this.selectedFile, this.uploadForm.value.eid).subscribe({
      next: (response: ImportResultDto) => { // 🔑 Check the response content here
        this.isUploading = false;
        this.resetForm();

        const insertedCount = response.inserted;
        const errorCount = response.errors.length;
        const totalCount = response.totalRows;

        if (errorCount === 0 && insertedCount > 0) {
          // Case 1: All questions imported successfully
          this.snackBar.open(`${insertedCount} questions imported successfully!`, 'Close', { duration: 7000, panelClass: ['success-snackbar'] });

        } else if (insertedCount > 0 && errorCount > 0) {
          // Case 2: Partial success - some inserted, some failed
          const successMsg = `Import Complete: ${insertedCount} inserted, ${errorCount} failed.`;
          this.snackBar.open(successMsg, 'View Errors', { duration: 15000, panelClass: ['warning-snackbar'] })
            .onAction().subscribe(() => {
              // 🔑 Display detailed error list in a new dialog/modal
              this.displayImportErrorsInSnackbar(response.errors);
            });

        } else if (insertedCount === 0 && errorCount > 0) {
          // Case 3: Total failure (but still HTTP 200)
          const failureMsg = `Import failed: ${errorCount} errors found.`;
          this.snackBar.open(failureMsg, 'View Errors', { duration: 15000, panelClass: ['error-snackbar'] })
            .onAction().subscribe(() => {
              // 🔑 Display detailed error list in a new dialog/modal
              this.displayImportErrorsInSnackbar(response.errors);
            });

        } else {
          // Case 4: File was empty/no data rows
          this.snackBar.open('File processed, but no questions were found.', 'Close', { duration: 7000, panelClass: ['info-snackbar'] });
        }
      },

      error: (error) => { // 🔑 This block handles true HTTP failures (4xx, 5xx)
        this.isUploading = false;
        let errorMessage = 'Failed to import questions due to a network or server issue.';

        if (error?.status === 400 && error.error?.message) {
          errorMessage = error.error.message; // Use specific 400 message if available
        } else if (error?.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        }

        this.snackBar.open(errorMessage, 'Close', { duration: 7000, panelClass: ['error-snackbar'] });
      }
    });
  }

  /**
   * Placeholder function to display the list of row errors using a Material Dialog.
   */
  // NOT recommended for showing full error lists

private displayImportErrorsInSnackbar(errors: ImportResultDto['errors']): void {
  // Take only the first 3 errors to fit the Snackbar space
  const displayErrors = errors.slice(0, 3);
  
  let errorMessage = `Failed rows: ${errors.length}. See console for full list.`;

  // Concatenate the first few errors for a little detail
  displayErrors.forEach(err => {
    errorMessage += ` [Row ${err.rowNumber}: ${err.message.substring(0, 20)}...]`;
  });
  
  // Show the message without an action button, relying on duration
  this.snackBar.open(errorMessage, 'Close', { 
    duration: 10000, 
    panelClass: ['error-snackbar'] 
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

