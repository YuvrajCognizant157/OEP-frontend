import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface JwtTokenData {
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem('token');
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
    this.router.navigate(['/login']);
  }
}
