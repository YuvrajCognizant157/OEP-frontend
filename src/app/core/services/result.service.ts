import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private baseUrl = 'https://localhost:44395/api/Results';

  constructor(private http: HttpClient) {}

  viewResult(examId: number, userId: number) {
    return this.http.post(`${this.baseUrl}/view-exam-results/${examId}?userid=${userId}`, {});
  }

  createResult(examId: number, userId: number) {
    return this.http.post(`${this.baseUrl}/create-results/${examId}?userid=${userId}`, {});
  }

  viewResultsByUserId(userId: number) {
    return this.http.get(`${this.baseUrl}/all-results/${userId}`);
  }
}