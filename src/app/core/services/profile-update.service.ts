import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUser } from '../../shared/profile-update/profile-update.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  private backendUrl = environment.apiUrl;
  private apiUrl = `${this.backendUrl}/api/Auth`;

  constructor(private http: HttpClient) {}

  updateUser(user: UpdateUser): Observable<any> {
    return this.http.put(this.apiUrl, user);
  }
}
