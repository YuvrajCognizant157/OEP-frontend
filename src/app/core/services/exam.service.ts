import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetExamDataDTO, SubmittedExamDTO } from '../../shared/models/exam.model';
import { AvailableExam, ExamDetails } from '../../shared/models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = 'https://localhost:44395/api/Exams';

  constructor(private http: HttpClient) {}

  getExams(): Observable<GetExamDataDTO[]> {
    return this.http.get<GetExamDataDTO[]>(`${this.baseUrl}/get-exams`);
  }

  getAvailableExams(studentId:number): Observable<AvailableExam[]> {
    return this.http.get<AvailableExam[]>(`${this.baseUrl}/get-s-exams/${studentId}`);
  }

  getExamDetails(examId: number): Observable<ExamDetails> {
    return this.http.get<ExamDetails>(`${this.baseUrl}/get-exams/${examId}`);
  }

  startExam(examId: number, userId: number) {
    return this.http.post(`${this.baseUrl}/start-exam/${examId}?userId=${userId}`, {});
  }

  
  submitExam(examData: SubmittedExamDTO) {
    return this.http.post(`${this.baseUrl}/submit-exam`, examData);
  }

}
