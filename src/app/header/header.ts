import { Component, effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../core/services/profile.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header{
  public userFullName =  signal<string | null>(null);
  public isMenuOpen = signal<boolean>(false);

  get isLoggedIn(): boolean {
    return this.loginService.loginStatus() ? true : false;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private loginService: LoginService
  ) {
    
    this.loginService.loginStatus.set( !!localStorage.getItem("token"));

    effect(() => {
      if (this.loginService.loginStatus()) {
        
        this.profileService.getUserProfile()?.subscribe({
          next: (profileData) => {
            this.userFullName.set(profileData?.fullName ?? 'User');
          },
          error: (err) => {
            this.userFullName.set('User_Error');
            alert('some error occured fetching user details ' + err);
          },
        });
      } else {
        this.userFullName.set('User');
      }
    });
  }


  getRole(): string | null {
    if (!this.isLoggedIn) return null;
    const userRole = localStorage.getItem('userRole')?.toLocaleLowerCase();

    return userRole ? userRole : null;
  }

  handleAuthAction() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.loginService.loginStatus.set(false);
    } else {
      this.router.navigate(['/login']);
    }
  }
  login() {
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen()); // Toggle menu state
  }

}
