import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordReset {
  private apiUrl = 'https://localhost:44395/api/Auth';

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
