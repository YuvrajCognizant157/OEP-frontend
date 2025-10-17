import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardAvatar } from '@angular/material/card';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, RouterLink, MatCardAvatar],
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

  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
    return initials;
  }

  // getFirstName(): string | null {
  //   if (!this.isLoggedIn) return null;
  //   const userName = this.authService.getUserRole()?.name;
  //   return userName ? userName : null;
  // }

  getRole(): string | null {
    if (!this.isLoggedIn) return null;
    const userRole = this.authService.getUserRole()?.role?.toLocaleLowerCase();
    
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