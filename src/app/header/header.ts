import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// NOTE: Replace these service imports with your actual service paths
import { AuthService } from '../core/services/auth.service';
import { ProfileService } from '../core/services/profile.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  public userFullName = signal<string | null>(null);
  public isMenuOpen = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private loginService: LoginService
  ) {
    // initialize login status from localStorage into the signal maintained in LoginService
    this.loginService.loginStatus.set(!!localStorage.getItem('token'));

    effect(() => {
      if (this.loginService.loginStatus()) {
        // fetch profile
        this.profileService.getUserProfile()?.subscribe({
          next: (profileData) => this.userFullName.set(profileData?.fullName ?? 'User'),
          error: () => this.userFullName.set('User'),
        });
      } else {
        this.userFullName.set(null);
      }
    });
  }

  get isLoggedIn(): boolean {
    return !!this.loginService.loginStatus();
  }

  getRole(): string | null {
    if (!this.isLoggedIn) return null;
    return localStorage.getItem('userRole')?.toLowerCase() ?? null;
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  handleAuthAction() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.loginService.loginStatus.set(false);
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // helper used in template to compute dashboard link with exact matching behavior
  dashboardLink() {
    const role = this.getRole();
    if (role === 'student') return ['/student/dashboard'];
    if (role === 'admin') return ['/admin/dashboard'];
    return ['/examiner/dashboard'];
  }
}