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

  getExamById(examId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-exams/e/${examId}`);
  }

  addExam(examData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-exam`, examData);
  }

  updateExam(examId: number, examData: any): Observable<any> {
    console.log("received data in service");
    return this.http.put(`${this.apiUrl}/update-exam/${examId}`, examData);
  }

  deleteExam(examId: number): Observable<any> {
    // Implement the API call for deleting an exam
    return this.http.delete(`${this.apiUrl}/delete-exam/${examId}`);
  }
  
}