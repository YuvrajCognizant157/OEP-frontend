import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent {
  student = {
    name: 'Amish Raj',
    email: 'amishraj@example.com',
    examsAppeared: 12
  };
  questionsEncounteredPercent = 150;

  availableExams = [
    { id: 1, title: 'Angular Basics', duration: 60, marks: 50 },
    { id: 2, title: 'C# Advanced Concepts', duration: 90, marks: 100 }
  ];

  examHistory = [
    { title: 'Node.js Fundamentals', score: 42, total: 50, date: '2025-08-12', passed: true },
    { title: 'Database Design', score: 65, total: 100, date: '2025-09-10', passed: false }
  ];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [80, 72, 90],
        label: 'Average %',
        backgroundColor: '#90caf9', 
        borderColor: '#90caf9',
        borderWidth: 1,
      }
    ]
  };

 
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'x', 
    plugins: {
      legend: { labels: { color: '#fff' } }
    },
    scales: {
      x: { 
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Dark theme grid
      },
      y: { 
        ticks: { color: '#bbb' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } // Dark theme grid
      }
    }
  };

  startExam(id: number) {
    console.log('Starting exam', id);
  }
}