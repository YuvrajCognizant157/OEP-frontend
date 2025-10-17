import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ExamApprovalStatus } from '../../shared/models/exam-approval.model';

import { QuestionReview } from '../../shared/models/question-review.model';

import { BlockUser } from '../../shared/models/block-user.model';

import { ExamFeedback } from '../../shared/models/exam-feedback.model';

import { ApproveTopic } from '../../shared/models/approve-topic.model';

import { AdminAnalytics } from '../../shared/models/admin-analytics.model';


@Injectable({

  providedIn: 'root'

})

export class AdminService {

  private readonly apiUrl = 'https://localhost:44395/api/Admin';

  constructor(private http: HttpClient) {}

  /** ✅ Get list of exams pending approval */

  getExamsForApproval(): Observable<any[]> {

    return this.http.post<any[]>(`${this.apiUrl}/approve-exam-list`, {});

  }

  /** ✅ Approve or reject an exam */

  approveOrRejectExam(dto: ExamApprovalStatus): Observable<string> {

    return this.http.post(`${this.apiUrl}/approve-exam`, dto, { responseType: 'text' });

  }

  getAdminAnalytics(): Observable<AdminAnalytics> {
 return this.http.get<AdminAnalytics>(`${this.apiUrl}analytics`);
}

  /** ✅ Get all reported questions */

  getReportedQuestions(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/reported-questions`);

  }

  /** ✅ Review a reported question */

  reviewReportedQuestion(dto: QuestionReview): Observable<string> {

    return this.http.post(`${this.apiUrl}/review-questions`, dto, { responseType: 'text' });

  }

  /** ✅ Block user */

  blockUser(dto: BlockUser): Observable<string> {

    return this.http.post(`${this.apiUrl}/block-users`, dto, { responseType: 'text' });

  }

  /** ✅ Fetch all feedback for an exam */

  getExamFeedback(examId: number): Observable<ExamFeedback[]> {

    return this.http.get<ExamFeedback[]>(`${this.apiUrl}/exam-feedback-review/${examId}`);

  }

  /** ✅ Add remarks */

  addAdminRemarks(examId: number, remarks: string): Observable<string> {

    return this.http.post(`${this.apiUrl}/add-adminremarks/${examId}`, remarks, {

      headers: { 'Content-Type': 'application/json' },

      responseType: 'text'

    });

  }

  /** ✅ Get topics pending approval */

  getTopicsForApproval(userId: number): Observable<ApproveTopic[]> {

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<ApproveTopic[]>(`${this.apiUrl}/topic-list`, { params });

  }

  /** ✅ Approve or reject topic */

  approveOrRejectTopic(topicId: number, userId: number): Observable<number> {

    const params = new HttpParams()

      .set('topicId', topicId.toString())

      .set('userId', userId.toString());

    return this.http.patch<number>(`${this.apiUrl}/approve-topic`, null, { params });

  }

}
 