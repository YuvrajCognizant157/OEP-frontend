import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetExamDataDTO } from '../../shared/models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = 'https://localhost:44395/api/exams';

  constructor(private http: HttpClient) {}

  getExams(): Observable<GetExamDataDTO[]> {
    return this.http.get<GetExamDataDTO[]>(`${this.baseUrl}/get-exams`);
  }
}