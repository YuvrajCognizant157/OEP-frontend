import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-s-analytics',
  imports: [CommonModule,
     MatCardModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './s-analytics.html',
  styleUrl: './s-analytics.css'
})
export class SAnalytics {
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Performance by Subject' }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Math', 'Science', 'English', 'History', 'CS'],
    datasets: [
      { data: [85, 92, 78, 88, 95], label: 'Score (%)', backgroundColor: '#46ccd5' }
    ]
  };

  // ---- Pie Chart ----
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Time Spent Distribution' }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Reading', 'Practice', 'Tests', 'Break'],
    datasets: [{
      data: [30, 40, 20, 10],
      backgroundColor: ['#46ccd5', '#5e60ce', '#48bfe3', '#64dfdf']
    }]
  };
  public pieChartType: ChartType = 'pie';

   // ---- Doughnut Chart ----
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Accuracy by Category' }
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['MCQs', 'Descriptive', 'Coding', 'Projects'],
    datasets: [{
      data: [78, 85, 90, 95],
      backgroundColor: ['#5e60ce', '#46ccd5', '#48bfe3', '#64dfdf']
    }]
  };

  // ---- Line Chart ----
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Weekly Progress Trend' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [60, 72, 85, 90],
        label: 'Progress (%)',
        borderColor: '#46ccd5',
        backgroundColor: 'rgba(70, 204, 213, 0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  };
}
