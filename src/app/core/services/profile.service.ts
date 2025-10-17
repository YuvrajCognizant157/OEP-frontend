import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface userDetails {
  id?: number;
  role: string;
  fullName: string;
  phoneNo?: number;
  email:string;
  dob:Date;
  isBlocked?:boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

private baseUrl = 'https://localhost:44395/api/Users';

private userUrl(id: number): string {
    return `${this.baseUrl}/${encodeURIComponent(String(id))}`;
}


  // Return an Observable if the user id is available, otherwise null
  getUserRole(): Observable<userDetails> | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    if (!this.authService.isLoggedIn()) {
      return null;
    }

    const authUser = this.authService.getUserRole();
    const id = authUser?.id;
    if (id === undefined || id === null) {
      return null;
    }

    // http.get returns an Observable<userDetails>
    return this.http.get<userDetails>(this.userUrl(id));
  }

}
