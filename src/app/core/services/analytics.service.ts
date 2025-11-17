import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAnalytics } from '../../shared/models/admin-analytics.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private backendUrl = environment.apiUrl;
  private apiUrl = `${this.backendUrl}/api/Analytics`;

  constructor(private http: HttpClient) { }

  getExaminerAnalytics(examinerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/examiner/${examinerId}`);
  }
    getAdminAnalytics(): Observable<any> {
 return this.http.get<AdminAnalytics>(`${this.apiUrl}/admin`);
}

  getStudentAnalytics(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  getTotalActiveExams(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-active-exams`);
  }

  getTotalActiveQuestions(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-active-questions`);
  }

  getTopicWiseQuestionCount(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/topic-wise-questions-attempted/${studentId}`);
  }
}
