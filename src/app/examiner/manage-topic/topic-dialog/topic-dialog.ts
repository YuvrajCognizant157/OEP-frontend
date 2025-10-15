import { Component, ChangeDetectionStrategy, inject, signal, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// --- Angular Material Imports ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Topic {
  tid: number;
  subject: string;
  approvalStatus: number; // Assuming 1: Approved, 0: Pending, -1: Rejected

}
@Component({
  selector: 'app-topic-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './topic-dialog.html',
  styleUrl: './topic-dialog.css'
})
export class TopicDialog {
  topicForm: FormGroup;
  isLoading = signal(false);
  feedbackMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<TopicDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; topic?: Topic }
  ) {
    this.topicForm = new FormGroup({
      name: new FormControl(data.topic?.subject || '', [Validators.required, Validators.minLength(2)]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      return;
    }
    this.isLoading.set(true);
    this.feedbackMessage.set('');
    this.dialogRef.disableClose = true;

    // The component that opens this dialog will handle the API call.
    // We just pass the form value back.
    this.dialogRef.close(this.topicForm.value);
  }
}
