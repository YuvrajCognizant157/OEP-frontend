import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterEmployeeRequest } from '../../register/register-employee/register-employee.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class RegisterEmployeeService {
  private backendUrl = environment.apiUrl;
  private apiUrl = `${this.backendUrl}/api/Auth/internal/register`;

  constructor(private http: HttpClient) {}

  registerExaminer(data: RegisterEmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
