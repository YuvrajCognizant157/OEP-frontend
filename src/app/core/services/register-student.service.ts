import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterStudentRequest } from '../../register/register-student/register-student.model';
import { environment } from '../../../environments/environment.prod';

export interface RegisterResponse {
  msg: string;
  userId: number;
  otp: number;
}

@Injectable({ providedIn: 'root' })
export class RegisterStudentService {
  private backendUrl = environment.apiUrl;
  private apiUrl = `${this.backendUrl}/api/Auth/student/register`;

  constructor(private http: HttpClient) {}

  registerStudent(data: RegisterStudentRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, data); 
  }
}
