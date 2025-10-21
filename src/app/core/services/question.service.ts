import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListQuestionsByExaminerId } from '../../shared/models/questions.model';

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

  getQuestionsByExaminer(examinerId: number, page: number, pageSize: number): Observable<{ results: ListQuestionsByExaminerId[]; count: number }> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());

    return this.http.get<{ results: ListQuestionsByExaminerId[]; count: number }>(
        `${this.apiUrl}/get-questions-by-uid/${examinerId}`, // <- Use examinerId in the URL path
        { params }
    );
  }

  deleteQuestion(questionId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete-a-question/${questionId}`, { responseType: 'text' as 'json' });
  }

  getQuestionById(questionId: number): Observable<ListQuestionsByExaminerId> {
    return this.http.get<ListQuestionsByExaminerId>(`${this.apiUrl}/get-question-by-id/${questionId}`);
  }

  updateQuestion(questionId: number, questionData: AddQuestionPayload): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update-question/${questionId}`, questionData, { responseType: 'text' as 'json' });
  }

  
}