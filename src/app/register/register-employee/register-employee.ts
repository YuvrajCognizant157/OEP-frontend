import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  role = 'Examiner';
  token = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const registerData = {
      email: this.email,
      fullName: this.fullName,
      password: this.password,
      dob: this.dob,
      phoneNo: this.phoneNo,
      role: this.role,
      token: this.token
    };

    this.http.post('http://localhost:8080/api/auth/register-examiner', registerData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error(err);
      }
    });
  }
}
