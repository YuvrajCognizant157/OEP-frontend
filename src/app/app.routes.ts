import { Routes } from '@angular/router';
import { StudentAuthGuard } from './auth/student-auth.guard';
import { ExaminerAuthGuard } from './auth/examiner-auth.guard';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'about', loadComponent: () => import('./about/about').then((m) => m.About)  },
  {
    path: 'login',
    loadComponent: () => import('./shared/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register-employee',
    loadComponent: () => import('./register/register-employee/register-employee').then(m => m.RegisterEmployeeComponent)
  },
  {
    path: 'register-student',
    loadComponent: () => import('./register/register-student/register-student').then(m => m.RegisterStudentComponent)
  },
  {
    path: 'student/start-exam',
    loadComponent: () => import('./exam/start-exam/start-exam').then((m) => m.StartExam),
    canActivate: [StudentAuthGuard],
  },
  {
    path: 'student/review-exam',
    loadComponent: () => import('./exam/review-exam/review-exam').then((m) => m.ReviewExam),
    canActivate: [StudentAuthGuard],
  },
  {
    path: 'student/view-reported-questions',
    loadComponent: () =>
      import('./question/question-feedback/question-feedback').then((m) => m.QuestionFeedback),
    canActivate: [StudentAuthGuard],
  },
  {
    path: 'examiner/dashboard',
    loadComponent: () => import('./examiner/dashboard/dashboard').then((m) => m.Dashboard),
    // canActivate: [ExaminerAuthGuard],
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./examiner/e-analytics/e-analytics').then((m) => m.EAnalytics),
        // canActivate: [ExaminerAuthGuard],
      },
      {
        path: 'exams',
        loadComponent: () => import('./examiner/exams/exams').then((m) => m.Exams),
        // canActivate: [ExaminerAuthGuard],
      },
      {
        path: 'topics',
        loadComponent: () => import('./examiner/topics/topics').then((m) => m.Topics),
        // canActivate: [ExaminerAuthGuard],
      },
      {
        path: 'create-exam',
        loadComponent: () => import('./examiner/create-exam/create-exam').then((m) => m.CreateExam),
        // canActivate: [ExaminerAuthGuard],
      },
      {
        path: 'manage-topic',
        loadComponent: () => import('./examiner/manage-topic/manage-topic').then((m) => m.ManageTopic),
        // canActivate: [ExaminerAuthGuard],
      },
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
    ],
  },
  {
    path: 'student/results',
    loadComponent: () =>
      import('./student/results/results.component').then((m) => m.ResultsComponent),
    canActivate: [StudentAuthGuard],
  },

  /*Angular routes are relative to the app's root, not the browser's URL path. So using '/' as a redirect target doesn't work as expected. It may cause infinite redirects or blank pages.
  */

  { path: '**', redirectTo: '' },
];
