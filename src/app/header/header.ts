import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardAvatar } from '@angular/material/card';
import { ProfileService } from '../core/services/profile.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, RouterLink, MatCardAvatar],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {

  public userFullName: string | null = null;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }  

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    // 2. Fetch full name when the component loads and the user is logged in
    if (this.isLoggedIn) {
      this.profileService.getUserProfile()?.subscribe({
        next: (profileData) => {
          // Assuming the service returns an object with a 'fullName' property
          if (profileData && profileData.fullName) {
            this.userFullName = profileData.fullName;
            }
          },
          error: (err) => {
            console.error('Failed to load user profile:', err);
            // Optionally handle error, e.g., set name to null or 'User'
            this.userFullName = 'User'; 
          }
        });
    }
  }

  getRole(): string | null {
    if (!this.isLoggedIn) return null;
    const userRole = localStorage.getItem('userRole')?.toLocaleLowerCase();

    return userRole ? userRole : null;
  }

  handleAuthAction() {
    if (this.isLoggedIn) {

      this.authService.logout();

    } else {

      this.router.navigate(['/login']);
    }
  }
  login() {
    this.router.navigate(['/login']);
  }

}