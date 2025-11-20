import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({providedIn: 'root'})
export class ExaminerService {

  private baseUrl: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.baseUrl = `${this.env.apiUrl}/api/Exams`;
  }

  getExamsForExaminer(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-exams/e?userid=${userId}`);
  }

  getExamById(examId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-exams/e/${examId}`);
  }

  addExam(examData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-exam`, examData);
  }

  updateExam(examId: number, examData: any): Observable<any> {
    console.log("received data in service");
    return this.http.put(`${this.baseUrl}/update-exam/${examId}`, examData);
  }

  deleteExam(examId: number): Observable<any> {
    // Implement the API call for deleting an exam
    return this.http.delete(`${this.baseUrl}/delete-exam/${examId}`);
  }

  sendExamForApproval(examId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/approval-exam/${examId}`, {});
  }
  
}
