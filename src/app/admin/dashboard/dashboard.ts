import { Component, OnInit } from '@angular/core';

import { CommonModule, DecimalPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterLink, RouterOutlet ,RouterModule} from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { AdminAnalytics } from '../../shared/models/admin-analytics.model';

import { AnalyticsService } from '../../core/services/analytics.service';

import { Router } from '@angular/router';

@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [CommonModule, MatCardModule, MatIconModule, MatToolbarModule, RouterLink, RouterOutlet,DecimalPipe,RouterModule],

  templateUrl: './dashboard.html',

  styleUrls: ['./dashboard.css']

})

export class DashboardComponent implements OnInit {

  analytics?: AdminAnalytics;

  loading = true;
isMenuOpen = false;
toggleMenu() {
 this.isMenuOpen = !this.isMenuOpen;
}
closeMenu() {
 this.isMenuOpen = false;
}

  constructor(private adminService: AdminService,private analyticservice: AnalyticsService,public router:Router) {}

  ngOnInit(): void {

    this.analyticservice.getAdminAnalytics().subscribe({

      next: (data) => {
        console.log('Admin analytics data:', data);      
        
        this.analytics = data.value;
        console.log('Admin analytics set to:', this.analytics);
        

        this.loading = false;

      },

      error: (err) => {

        console.error('Error fetching analytics:', err);

        this.loading = false;

      }

    });
    window.addEventListener('resize', () => {
   if (window.innerWidth > 950 && this.isMenuOpen) {
     this.isMenuOpen = false;
   }
 });

  }

}
 