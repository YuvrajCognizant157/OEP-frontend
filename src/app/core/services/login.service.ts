import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/login/login.model'; 

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'https://localhost:44395/api/Auth';

  constructor(private http: HttpClient) {}

  /**
   * Sends login request to backend
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
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