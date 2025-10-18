import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUser } from '../../shared/profile-update/profile-update.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  private apiUrl = 'https://localhost:44395/api/Auth';

  constructor(private http: HttpClient) {}

  updateUser(user: UpdateUser): Observable<any> {
    return this.http.put(this.apiUrl, user);
  }
}