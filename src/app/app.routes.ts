import { Routes } from '@angular/router';
// import { StudentAuthGuard } from './core/guards/student-auth.guard';

export const routes: Routes = [
  {
    path: 'student/start-exam',
    loadComponent: () => import('./exam/start-exam/start-exam').then((m) => m.StartExam),
  },
  {
    path: 'student/review-exam',
    loadComponent: () => import('./exam/review-exam/review-exam').then((m) => m.ReviewExam),
  },
  {
    path: 'student/view-reported-questions',
    loadComponent: () =>
      import('./question/question-feedback/question-feedback').then((m) => m.QuestionFeedback),
  },
  {
    path: 'examiner/dashboard',
    loadComponent: () => import('./examiner/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./examiner/e-analytics/e-analytics').then((m) => m.EAnalytics),
      },
      {
        path: 'exams',
        loadComponent: () => import('./examiner/exams/exams').then((m) => m.Exams),
      },
      {
        path: 'topics',
        loadComponent: () => import('./examiner/topics/topics').then((m) => m.Topics),
      },
      {
        path:'create-exam',
        loadComponent: () => import('./examiner/create-exam/create-exam').then((m) => m.CreateExam)
      },
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
    ],
  },
  {
    path: 'student/results',
    loadComponent: () =>
      import('./student/results/results.component').then((m) => m.ResultsComponent),
    // canActivate: [StudentAuthGuard]
  },

  { path: '', redirectTo: 'examiner/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
