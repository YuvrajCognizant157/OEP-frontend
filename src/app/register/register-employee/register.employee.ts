import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RegisterEmployeeRequest } from './register-employee.model';
import { RegisterEmployeeService } from '../../core/services/register-employee.service';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register-employee.html',
  styleUrls: ['./register-employee.css']
})
export class RegisterEmployeeComponent {
  email = '';
  fullName = '';
  password = '';
  dob: string = '';
  phoneNo = '';
  token = '';
  errorMessage = '';
  successMessage = '';

  constructor(private registerService: RegisterEmployeeService, private router: Router) {}

  onSubmit(): void {
    const registerData: RegisterEmployeeRequest = {
      email: this.email,
      fullName: this.fullName,
      password: this.password,
      dob: this.dob,
      phoneNo: this.phoneNo,
      token: this.token
    };    
    this.registerService.registerExaminer(registerData).subscribe({
      next: (response) => {
      this.successMessage = response.message;
      this.router.navigate(['/login']); // or redirect based on role
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        console.error(err);
      }
    });
  }
}