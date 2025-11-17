import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ResultCalculationResponseDTO} from '../../shared/models/result.model';
import { environment } from '../../../environments/environment.prod';
@Injectable({ providedIn: 'root' })
export class ResultService {
  private backendUrl = environment.apiUrl;
  private baseUrl = `${this.backendUrl}/api/Results`;

  constructor(private http: HttpClient) {}

  viewResult(examId: number, userId: number) {
    return this.http.post(`${this.baseUrl}/view-exam-result/${examId}?userid=${userId}`, {});
  }

  createResult(examId: number, userId: number) : Observable<any> {
    return this.http.post(`${this.baseUrl}/create-results/${examId}?userid=${userId}`, {});
  }

  viewResultsByUserId(userId: number) :Observable<any> {
    return this.http.get(`${this.baseUrl}/all-results/${userId}`);
  }

  createAndViewResult(examId: number,userId:number){
    return this.http.get<ResultCalculationResponseDTO>(`${this.baseUrl}/calculate/${examId}/${userId}`);
  }
}
