import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RegisterStudentRequest } from './register-student.model';
import { RegisterStudentService } from '../../core/services/register-student.service';

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
  successMessage = '';

  constructor(private registerService: RegisterStudentService, private router: Router) {}

  onSubmit(): void {
    const registerData: RegisterStudentRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNo: this.phoneNo,
      dob: this.dob
    };

    this.registerService.registerStudent(registerData).subscribe({
    next: (response) => {
      this.successMessage = response.message;

      if (response.role === 'Student') {
        this.router.navigate(['/student/dashboard']); 
      } else {
        this.router.navigate(['/login']); // fallback
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      console.error(err);
    }
    });
  }
}
