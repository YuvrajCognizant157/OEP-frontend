import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import spinner module

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
    MatCardModule,
    MatProgressSpinnerModule
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
  isLoading = false;

  constructor(private registerService: RegisterStudentService, private router: Router,private authService : AuthService) {}

  onSubmit(): void {

   this.isLoading = true;
    this.errorMessage = '';
    this.successMessage.set('');

    const registerData: RegisterStudentRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNo: this.phoneNo,
      dob: this.dob
    };

    this.registerService.registerStudent(registerData).subscribe({
    next: (response:RegisterResponse) => {
      this.isLoading = false; 
      this.successMessage.set(response.msg);

      const newUserId = response.userId; 
      if (newUserId) { 
          this.authService.pendingVerificationUserId.set(newUserId);
          this.router.navigate([`/verify-otp/${newUserId}`]);
        } else {
          // Handle case where API succeeds but doesn't return a valid ID
          this.errorMessage = "Registration successful, but an error occurred. Please try logging in.";
          this.router.navigate(['/login']);
        }
    },
    error: (err) => {
      this.isLoading = false; 
      this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      console.error(err);
    }
    });
  }
}
