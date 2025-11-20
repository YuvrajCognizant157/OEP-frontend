import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({ providedIn: 'root'})
export class PasswordReset {
  private apiUrl :string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = `${this.env.apiUrl}/api/Auth`;
  }

  requestOtp(email:string , verifyWithEmail : boolean) : Observable<any>{
    const body = {email,verifyWithEmail};
    return this.http.post(`${this.apiUrl}/request-otp`,body);
  }
  resetPassword(email: string, otp: number, newPassword: string): Observable<any> {
    const body = { email, otp, newPassword };
    return this.http.post(`${this.apiUrl}/reset`, {email:email,Otp:otp,NewPassword:newPassword});
  }
  
}
