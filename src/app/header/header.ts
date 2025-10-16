import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  getRole(): string | null {
    if (!this.isLoggedIn) return null;
    const userRole = this.authService.getUserRole()?.role?.toLocaleLowerCase();

    console.log("userRole in header:", userRole);
    
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
