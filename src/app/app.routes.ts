import { Routes } from '@angular/router';
import { ResultsComponent } from './student/results/results.component';
// import { StudentAuthGuard } from './core/guards/student-auth.guard';

export const routes: Routes = [
  {
    path:'exam/start-exam',
    loadComponent: () => import('./exam/start-exam/start-exam').then(m => m.StartExam)
  },
  {
    path: 'exam/review-exam',
    loadComponent: () => import('./exam/review-exam/review-exam').then(m => m.ReviewExam),
  },
  {
    path: 'student/results',
    loadComponent: () => import('./student/results/results.component').then(m => m.ResultsComponent),
    // canActivate: [StudentAuthGuard]
  },
  
  // { path: '', redirectTo: 'student/results', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
  
];