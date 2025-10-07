import { Routes } from '@angular/router';
import { ResultsComponent } from './student/results/results.component';
// import { StudentAuthGuard } from './core/guards/student-auth.guard';

export const routes: Routes = [
  {
    path: 'student/results',
    loadComponent: () => import('./student/results/results.component').then(m => m.ResultsComponent),
    // canActivate: [StudentAuthGuard]
  },
  { path: '', redirectTo: 'student/results', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];