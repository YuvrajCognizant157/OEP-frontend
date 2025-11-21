import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetQuestionFeedback } from '../../question/question-feedback/question-feedback.model';
import { EnvService } from './env.service';

export interface AddQuestionFeedbackDTO {
  feedback: string;
  qid: number;
  studentId: number;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private baseUrl: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.baseUrl = `${this.env.apiUrl}/api/QuestionFeedback`;
  }

  getAllFeedbacksByUserId(userId: number): Observable<GetQuestionFeedback[]> {
    return this.http.get<GetQuestionFeedback[]>(`${this.baseUrl}/get-all-question-feedbacks-by-userId/${userId}`);
  }
  addQuestionFeedback(payload: AddQuestionFeedbackDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-question-feedback`, payload);
  }

  getAllExamFeedbacksByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/api/ExamFeedback/all-exam-feedbacks-s/${userId}`);
  }
}
