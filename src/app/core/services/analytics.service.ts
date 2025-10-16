import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private apiUrl = 'https://localhost:44395/api/Analytics';

  constructor(private http: HttpClient) { }

  getExaminerAnalytics(examinerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/examiner/${examinerId}`);
  }
}