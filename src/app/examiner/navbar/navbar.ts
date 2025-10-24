import { Component, inject } from '@angular/core';
import {  RouterLink, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule,MatButtonModule,CommonModule,RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  isMenuOpen = false;
toggleMenu() {
 this.isMenuOpen = !this.isMenuOpen;
}
closeMenu() {
 this.isMenuOpen = false;
}
ngOnInit(): void {
 // Auto-close drawer when resizing to desktop view
 window.addEventListener('resize', () => {
   if (window.innerWidth > 950 && this.isMenuOpen) {
     this.isMenuOpen = false;
   }
 });
}
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
