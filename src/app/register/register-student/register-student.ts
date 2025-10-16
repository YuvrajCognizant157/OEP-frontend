import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const registerData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNo: this.phoneNo,
      dob: this.dob
    };

    this.http.post('http://localhost:8080/api/auth/register-student', registerData).subscribe({
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

