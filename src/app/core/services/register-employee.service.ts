import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterEmployeeRequest } from '../../register/register-employee/register-employee.model';

@Injectable({ providedIn: 'root' })
export class RegisterEmployeeService {
  private apiUrl = 'https://localhost:44395/api/Auth';

  constructor(private http: HttpClient) {}

  registerExaminer(data: RegisterEmployeeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-examiner`, data);
  }
}