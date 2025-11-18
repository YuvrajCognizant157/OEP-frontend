import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PasswordReset {
  private backendUrl = environment.apiUrl;
  private apiUrl = `${this.backendUrl}/api/Auth`;

  constructor(private http : HttpClient){}

  requestOtp(email:string , verifyWithEmail : boolean) : Observable<any>{
    const body = {email,verifyWithEmail};
    return this.http.post(`${this.apiUrl}/request-otp`,body);
  }
  resetPassword(email: string, otp: number, newPassword: string): Observable<any> {
    const body = { email, otp, newPassword };
    return this.http.post(`${this.apiUrl}/reset`, {email:email,Otp:otp,NewPassword:newPassword});
  }
  
}
