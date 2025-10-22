import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetails } from '../../shared/profile/user.model';

export interface userDetails {
    id?: number;
    role: string;
    fullName: string;
    phoneNo?: number;
    email: string;
    dob: Date;
    isBlocked?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(private router: Router,
        private authService: AuthService,
        private http: HttpClient
    ) { }

    private baseUrl = 'https://localhost:44395/api/Users';

    private userUrl(id: number): string {
        return `${this.baseUrl}/${encodeURIComponent(String(id))}`;
    }


    // Return an Observable if the user id is available, otherwise null
    getUserProfile(): Observable<userDetails> | null {
        const token = localStorage.getItem('token');
        if (!token) return null;
        if (!this.authService.isLoggedIn()) {
            return null;
        }

        const id = Number(localStorage.getItem("userId"));
        if (id === undefined || id === null) {
            return null;
        }
        // http.get returns an Observable<userDetails>
        return this.http.get<userDetails>(this.userUrl(id))
            .pipe(
                map(user => ({ ...user, id }))
            ); 
    }

    
    getUserById(id: number) {
        return this.http.get<UserDetails>(`${this.baseUrl}/${id}`);
    }

    updateUser(id: number, data: Partial<UserDetails>) {
        return this.http.patch(`${this.baseUrl}/${id}`, data);
    }

}

