import { Component,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(
    private authService: AuthService, 
    private router: Router // Inject Router for manual navigation if needed
  ) {}

  ngOnInit(): void {
    // Initialization logic if required
  }

  /**
   * Handles the click event on the auth button.
   */
  handleAuthAction() {
    if (this.isLoggedIn) {
      // If logged in, execute the logout logic from the AuthService
      this.authService.logout();
      // The button text/style will automatically update because 'isLoggedIn' is a getter.
    } else {
      // If not logged in, navigate to the login page (handled by routerLink in HTML, 
      // but explicitly navigating here for clarity if using router.navigate)
      this.router.navigate(['/login']);
    }
  }

  /**
   * Directly navigates to the login page if the button is clicked when logged out.
   * NOTE: The HTML uses routerLink to handle this, so this method mainly handles LOGOUT.
   */
  login() {
    this.router.navigate(['/login']);
  }

}
