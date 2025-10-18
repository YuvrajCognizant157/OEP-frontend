import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterStudentRequest } from '../../register/register-student/register-student.model';

@Injectable({ providedIn: 'root' })
export class RegisterStudentService {
  private apiUrl = 'https://localhost:44395/api/Auth/student/register';

  constructor(private http: HttpClient) {}

  registerStudent(data: RegisterStudentRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}