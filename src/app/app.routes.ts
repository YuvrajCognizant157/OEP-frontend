import { Routes } from '@angular/router';
import { StudentAuthGuard } from './auth/student-auth.guard';
import {  examinerAuthGuardFn } from './auth/examiner-auth.guard';
import { Home } from './home/home';
// Make sure the file exists at './admin/admin.component.ts' and exports AdminComponent.
// If the file is named differently, update the path accordingly, for example:
 // <-- Ensure this file exists and exports AdminComponent
import { DashboardComponent } from './admin/dashboard/dashboard';
import { BlockUserComponent } from './admin/block-user/block-user';
import {ApproveTopicComponent} from './admin/approve-topic/approve-topic';
import {ApproveExam} from './admin/approve-exam/approve-exam';
import {ApproveQuestion} from './admin/approve-question/approve-question';
import {ExamFeedbackComponent} from './admin/exam-feedback/exam-feedback';
//import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'about', loadComponent: () => import('./about/about').then((m) => m.About)  },
  {
    path: 'login',
    loadComponent: () => import('./shared/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./student/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
    canActivate: [StudentAuthGuard],
  },

  {
    path: 'register-employee',
    loadComponent: () => import('./register/register-employee/register.employee').then(m => m.RegisterEmployeeComponent)
  },
  {
    path: 'register-student',
    loadComponent: () => import('./register/register-student/register-student').then(m => m.RegisterStudentComponent)
  },
  
  {
    path: 'profile-update',
    loadComponent: () => import('./shared/profile-update/profile-update').then(m => m.ProfileUpdateComponent)
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
    canActivate: [examinerAuthGuardFn],
    canActivateChild:[examinerAuthGuardFn],
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
        path: 'create-exam',
        loadComponent: () => import('./examiner/create-exam/create-exam').then((m) => m.CreateExam),
      },
      {
        path: 'manage-topic',
        loadComponent: () => import('./examiner/manage-topic/manage-topic').then((m) => m.ManageTopic),
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
{
    path: 'admin/dashboard',
    component: DashboardComponent,
    children: [
      {
        path:'',component:DashboardComponent
      },
      {
        path: 'approve-exam',
        component: ApproveExam
      },
      {
        path: 'approve-question',
        component: ApproveQuestion
      },
      {
        path: 'approve-topic',
        component: ApproveTopicComponent
      },
      {
        path: 'block-users',
        component: BlockUserComponent
      },
      {
        path: 'exam-feedback',
        component: ExamFeedbackComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];


  //{ path: '**', redirectTo: '' },

