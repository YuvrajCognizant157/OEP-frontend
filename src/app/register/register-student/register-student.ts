import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RegisterStudentRequest } from './register-student.model';
import { RegisterStudentService } from '../../core/services/register-student.service';
import { AuthService } from '../../core/services/auth.service';

interface RegisterResponse {
  msg :string;
  userId : number;
}

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register-student.html',
  styleUrls: ['./register-student.css']
})
export class RegisterStudentComponent {
  fullName = '';
  email = '';
  password = '';
  phoneNo = '';
  dob: string = '';
  errorMessage = '';
  successMessage = signal<string>("");

  constructor(private registerService: RegisterStudentService, private router: Router,private authService : AuthService) {}

  onSubmit(): void {
    const registerData: RegisterStudentRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNo: this.phoneNo,
      dob: this.dob
    };

    this.registerService.registerStudent(registerData).subscribe({
    next: (response:RegisterResponse) => {
      this.successMessage.set(response.msg);

      const newUserId = response.userId; 
      if (!newUserId) {
        throw Error;
      }
      this.authService.pendingVerificationUserId.set(newUserId);

      if(response.userId != null){
        this.router.navigate([`/verify-otp/${newUserId}`]); 
      }
       else {
        alert("Some Internal Server Error");
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      console.error(err);
    }
    });
  }
}
