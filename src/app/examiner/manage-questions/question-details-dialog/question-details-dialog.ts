import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

// Assume this is your service path
import { QuestionService } from '../../../core/services/question.service';
import { RawQuestionDetails,QuestionDetails } from '../../../shared/models/questions.model';
import { Observable } from 'rxjs';

// Interface for data passed *into* the dialog
export interface DialogData {
  questionId: number;
}

@Component({
  selector: 'app-question-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    KeyValuePipe
  ],
  templateUrl: './question-details-dialog.html',
  styleUrl: './question-details-dialog.css'
})
export class QuestionDetailsDialog implements OnInit {


  private questionService = inject(QuestionService);
  
  // Signals for reactive state management
  questionDetails = signal<QuestionDetails | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  constructor(
    public dialogRef: MatDialogRef<QuestionDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.loadQuestionDetails(this.data.questionId);
  }
// 🔑 Helper function to process the raw data
  private processRawData(raw: RawQuestionDetails): QuestionDetails {
    try {
      // 1. Deserialize options string into a JS object
      const parsedOptions = JSON.parse(raw.options);
      
      // 2. Deserialize correctOptions string into a JS array
      // Note: The correct options are strings (e.g., "3") representing the option key
      const parsedCorrectOptions = JSON.parse(raw.correctOptions); 
      
      return {
        questionId: raw.qid,
        questionText: raw.question, // Use 'question' field
        options: parsedOptions,
        correctOptions: parsedCorrectOptions,
        
        topicId: raw.topics.tid,
        topicName: raw.topics.topicName,
        examId: raw.eid,
        examTitle: raw.examTitle,
        type: raw.type,
        marks: raw.marks,
      };
    } catch (e) {
      console.error('Failed to parse options/correctOptions JSON:', e);
      // Fallback for corrupt data
      return {
        questionId: raw.qid,
        questionText: raw.question,
        options: {},
        correctOptions: [],
        topicId: raw.topics.tid,
        topicName: raw.topics.topicName,
        examId: raw.eid,
        examTitle: raw.examTitle,
        type: raw.type,
        marks: raw.marks,
      };
    }
  }


  loadQuestionDetails(id: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Assume service returns Observable<RawQuestionDetails>
    (this.questionService.getQuestionDetailsById(id) as Observable<RawQuestionDetails>).subscribe({
      next: (rawDetails) => {
        // 🔑 Process the raw data before setting the signal
        const cleanDetails = this.processRawData(rawDetails); 
        this.questionDetails.set(cleanDetails);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching question details:', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Helper function to check if an option is correct
  isCorrectOption(key: string): boolean {
    const details = this.questionDetails();
    if (!details) return false;
    // Check if the key (e.g., 'A') is included in the array of correct options
    return details.correctOptions.includes(key); 
  }


}
