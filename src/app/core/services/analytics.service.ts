import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAnalytics } from '../../shared/models/admin-analytics.model';
import { EnvService } from './env.service';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.baseUrl = `${this.env.apiUrl}/api/Analytics`;
  }

  getExaminerAnalytics(examinerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/examiner/${examinerId}`);
  }
    getAdminAnalytics(): Observable<any> {
      return this.http.get<AdminAnalytics>(`${this.baseUrl}/admin`);
}

  getStudentAnalytics(studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/student/${studentId}`);
  }

  getTotalActiveExams(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-active-exams`);
  }

  getTotalActiveQuestions(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-active-questions`);
  }

  getTopicWiseQuestionCount(studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/topic-wise-questions-attempted/${studentId}`);
  }
}
