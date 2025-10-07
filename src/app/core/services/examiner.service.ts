import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ExaminerService {
  private apiUrl = 'https://localhost:44395/api/Exams'; // Replace with your actual API base URL

  constructor(private http: HttpClient) { }

  getExaminerAnalytics(examinerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/examiner/${examinerId}`);
  }

  getExamsForExaminer(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-exams/e?userid=${userId}`);
  }

  getTopics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-topic`);
  }

  addExam(examData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-exam`, examData);
  }

  // Add more methods for other functionalities as needed
}