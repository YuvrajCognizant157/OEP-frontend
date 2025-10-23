import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';interface JwtTokenData {
  sub: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
  iss: string;
  aud: string;
}
export interface userDetails {
  id: number;
  role: string;
}

interface VerifyOtpRequest {
  otp:number;
  AllowSuccessMail :boolean;
}

interface ResendOtpResponse {
  msg :string;
  otp:number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44395/api/Auth';
  
  public pendingVerificationUserId = signal<number | null>(null);
  constructor(private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    if(!this.isLoggedIn()) {
      return null;
    }
    return localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);

      return expirationDate > new Date();
    } catch (e) {
      return false;
    }
  }


  getUserRole(): userDetails | null {
    const token = this.getToken();
    if (!token) return null;

    if (!this.isLoggedIn() || !token) {
      return null;
    }
    try {
      const payload: JwtTokenData = JSON.parse(atob(token.split('.')[1]));
      let data: userDetails = {
        id: Number(payload.sub),
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      };
      return data;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  verifyOTP(userId: number, otp: number,allowSuccessMail:boolean): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/student/verifyotp/${userId}`, {otp:otp,AllowSuccessMail:allowSuccessMail});
  }

  resendOTP(userId: number): Observable<ResendOtpResponse> {
    return this.http.get<ResendOtpResponse>(`${this.apiUrl}/student/resendotp/${userId}`);
  }
} 