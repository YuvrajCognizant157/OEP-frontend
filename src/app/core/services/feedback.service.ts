import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetQuestionFeedback } from '../../question/question-feedback/question-feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService{
    private baseUrl = 'https://localhost:44395/api/QuestionFeedback';
    constructor(private http: HttpClient) {}

    getAllFeedbacksByUserId(userId: number): Observable<GetQuestionFeedback[]> {
        return this.http.get<GetQuestionFeedback[]>(`${this.baseUrl}/get-all-question-feedbacks-by-userId/${userId}`);
    }
}