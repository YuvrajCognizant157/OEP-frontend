import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { trigger, transition, style, animate } from '@angular/animations';
import { LoginRequest, LoginResponse } from '../login/login.model'; // ✅ Import model
import { LoginService } from '../../core/services/login.service';
import { AuthService } from '../../core/services/auth.service';

const fadeSlide = trigger('fadeSlide', [
  transition(':enter', [
    style({ transform: 'translateY(-20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
  animations: [fadeSlide],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  private loginTimeout: any;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private authS: AuthService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.loginTimeout) {
      clearTimeout(this.loginTimeout);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = {
      email: this.username,
      password: this.password,
    };

    this.loginService.login(loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        let role = this.authS.getUserRole()?.role;
        let userId = this.authS.getUserRole()?.id;
        localStorage.setItem('userId', userId ? userId.toString() : '');
        localStorage.setItem('userRole', role ? role : '');

        const userDetails = this.authS.getUserRole();
        if (!userDetails) {
          this.router.navigate(['/unauthorized']);
          return;
        }

        switch (userDetails.role) {
          case 'Examiner':
            this.router.navigate(['/employee/dashboard']);
            break;
          case 'Student':
            this.router.navigate(['/student/dashboard']);
            break;
          case 'Admin':
            this.router.navigate(['/admin/dashboard']);
            break;
          default:
            this.router.navigate(['/unauthorized']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        this.loading = false;
        console.error(err);
      },
      complete: () => {
        this.loginTimeout = setTimeout(() => {
          this.loading = false;
        }, 500);
      },
    });
  }
  registerAsEmployee(): void {
    this.router.navigate(['/register-employee']);
  }

  registerAsStudent(): void {
    this.router.navigate(['/register-student']);
  }
}
