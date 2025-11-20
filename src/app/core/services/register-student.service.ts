import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterStudentRequest } from '../../register/register-student/register-student.model';
import { EnvService } from './env.service';

export interface RegisterResponse {
  msg: string;
  userId: number;
  otp: number;
}

@Injectable({ providedIn: 'root' })
export class RegisterStudentService {
  private apiUrl: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = `${this.env.apiUrl}/api/Auth/student/register`;
}

  registerStudent(data: RegisterStudentRequest): Observable<RegisterResponse> {
    
    return this.http.post<RegisterResponse>(this.apiUrl, data); 
  }
}
