import { Routes } from '@angular/router';
// import { StudentAuthGuard } from './core/guards/student-auth.guard';

export const routes: Routes = [
  {
    path:'student/start-exam',
    loadComponent: () => import('./exam/start-exam/start-exam').then(m => m.StartExam)
  },
  {
    path: 'student/review-exam',
    loadComponent: () => import('./exam/review-exam/review-exam').then(m => m.ReviewExam),
  },
  {
    path: 'student/view-reported-questions',
    loadComponent: () => import('./question/question-feedback/question-feedback').then(m => m.QuestionFeedback),
  },
  {
    path: 'student/results',
    loadComponent: () => import('./student/results/results.component').then(m => m.ResultsComponent),
    // canActivate: [StudentAuthGuard]
  },
  
  // { path: '', redirectTo: 'student/results', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
  
];