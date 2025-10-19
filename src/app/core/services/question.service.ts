import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddQuestionPayload {
  type: string;
  question: string;
  options: string;
  tid: number;
  correctOptions: string[];
  approvalStatus: number;
}

export interface QuestionItem {
  Type: string;
  Question: string;
  Options: string;
  CorrectOptions: string[];
  ApprovalStatus: number;
}

export interface AddQuestionsByBatchPayload {
  tid: number;
  questions: QuestionItem[];
}


@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = 'https://localhost:44395/api/Questions';

  constructor(private http: HttpClient) { }

  // Method to add a single question
  addSingleQuestion(question: AddQuestionPayload, examId: number, userId: number): Observable<string> {
    const params = new HttpParams()
      .set('examId', examId.toString())
      .set('userId', userId.toString());

    return this.http.post<string>(`${this.apiUrl}/add-question`, question, { params, responseType: 'text' as 'json' });
  }

  // Method to add questions in a batch
  addMultipleQuestions(batch: AddQuestionsByBatchPayload, examId: number, userId: number): Observable<string> {
    const params = new HttpParams()
      .set('examId', examId.toString())
      .set('userId', userId.toString());

    return this.http.post<string>(`${this.apiUrl}/add-questions-by-tid-batch`, batch, { params, responseType: 'text' as 'json' });
  }
}