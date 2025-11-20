import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUser } from '../../shared/profile-update/profile-update.model';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';
@Injectable({providedIn: 'root'})
export class ProfileUpdateService {
  private apiUrl :string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = `${this.env.apiUrl}/api/Auth`;
  }

  updateUser(user: UpdateUser): Observable<any> {
    return this.http.put(this.apiUrl, user);
  }
}
