// s-navbar.ts (replace/merge)
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-s-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule
  ],
  templateUrl: './s-navbar.html',
  styleUrls: ['./s-navbar.css']
})
export class SNavbar implements OnInit, OnDestroy {
  navLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: 'home' },
    { label: 'Exams', path: '/student/available-exams', icon: 'border_color' },
    { label: 'Results', path: '/student/results', icon: 'assessment' },
    { label: 'Analytics', path: '/student/analytics', icon: 'analytics' },
    { label: 'Feedback', path: '/student/view-all-feedbacks', icon: 'feedback' }
  ];

  activeLinkIndex = 0;              // <-- default to 0 (never -1)
  isDrawerOpen = false;
  isMobileView = false;

  // bound listener so we can add/remove it reliably
  private resizeListener = () => this.checkScreenSize();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // set initial index from current url (important for direct loads)
    this.setActiveIndexFromUrl(this.router.url);

    // sync on each navigation end (use urlAfterRedirects to catch redirects)
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((ev: NavigationEnd) => {
        this.setActiveIndexFromUrl(ev.urlAfterRedirects || ev.url);
        this.closeDrawer(); // auto-close on navigation
      });

    // listen for window resize events without using HostListener decorator
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    // cleanup listener
    window.removeEventListener('resize', this.resizeListener);
  }

  private setActiveIndexFromUrl(url: string) {
    // use startsWith so child routes still highlight parent tab
    const idx = this.navLinks.findIndex(tab => url.startsWith(tab.path));
    this.activeLinkIndex = idx >= 0 ? idx : 0;
    // ensure change detection updates the mat-tab-group indicator
    // sometimes needed if this runs before view init
    this.cdr.detectChanges();
  }

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 900;
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }
}