import { Injectable, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/login/login.model'; 
//import { environment } from '../../../environments/environment.prod';
import { EnvService } from './env.service';

@Injectable({ providedIn: 'root' })
export class LoginService implements OnInit {
  //private backendUrl = environment.apiUrl;
  //private apiUrl = `${this.backendUrl}/api/Auth`;
  loginStatus = signal<boolean>(false);

  constructor(private http: HttpClient, private env: EnvService) { }

  ngOnInit() {
    console.log(this.env.apiUrl);
  }

  /**
   * Sends login request to backend
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    console.log(this.env.apiUrl);
    return this.http.post<LoginResponse>(`${this.env.apiUrl}/login`, data);
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
