import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterEmployeeRequest } from '../../register/register-employee/register-employee.model';
import { EnvService } from './env.service';

@Injectable({ providedIn: 'root' })
export class RegisterEmployeeService {
  private apiUrl:string ;

  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = `${this.env.apiUrl}/api/Auth/internal/register`;
  }

  registerExaminer(data: RegisterEmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
