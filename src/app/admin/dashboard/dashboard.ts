import { Component, OnInit } from '@angular/core';

import { CommonModule, DecimalPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterLink, RouterOutlet } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';

import { AdminAnalytics } from '../../shared/models/admin-analytics.model';

@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [CommonModule, MatCardModule, MatIconModule, MatToolbarModule, RouterLink, RouterOutlet,DecimalPipe],

  templateUrl: './dashboard.html',

  styleUrls: ['./dashboard.css']

})

export class DashboardComponent implements OnInit {

  analytics?: AdminAnalytics;

  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {

    this.adminService.getAdminAnalytics().subscribe({

      next: (data) => {

        this.analytics = data;

        this.loading = false;

      },

      error: (err) => {

        console.error('Error fetching analytics:', err);

        this.loading = false;

      }

    });

  }

}
 