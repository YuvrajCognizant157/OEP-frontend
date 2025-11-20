import { Injectable, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/login/login.model'; 
import { EnvService } from './env.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  loginStatus = signal<boolean>(false);
  private baseUrl: string;
  constructor(private http: HttpClient, private env: EnvService) {
    this.baseUrl = `${this.env.apiUrl}/api/Auth`;
  }

  /**
   * Sends login request to backend
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  /**
   * Checks if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Logs out the user
   */
  logout(): void {
    localStorage.removeItem('token');
  }

  /**
   * Gets the stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
