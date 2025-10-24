import { Routes } from '@angular/router';
import { StudentAuthGuard } from './core/auth-guards/student-auth.guard';
import {  examinerAuthGuardFn } from './core/auth-guards/examiner-auth.guard';
import { Home } from './home/home';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { BlockUserComponent } from './admin/block-user/block-user';
import {ApproveTopicComponent} from './admin/approve-topic/approve-topic';
import {ApproveExamComponent} from './admin/approve-exam/approve-exam';
import {ExamFeedbackComponent} from './admin/exam-feedback/exam-feedback';
import { ReportedQuestionsComponent } from './admin/reported-questions/reported-questions';
import { ReviewExamComponent } from './admin/review-exam/review-exam';
import { profileAuthGuardfn } from './core/auth-guards/profile-auth.guard';
import { About } from './about/about';
import { LoggedInGuard } from './core/auth-guards/logged-in.guard';
import { AdminAuthGuard } from './core/auth-guards/admin-auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'about', component:About },
  {
    path: 'login',
    loadComponent: () => import('./shared/login/login').then(m => m.LoginComponent),
    // canActivate:[LoggedInGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./shared/forgot-password/forgot-password').then(m => m.ForgotPassword),
    // canActivate:[LoggedInGuard]
  },
  {
    path: 'register-employee',
    loadComponent: () => import('./register/register-employee/register.employee').then(m => m.RegisterEmployeeComponent),
    // canActivate:[LoggedInGuard]
  },
  {
    path: 'register-student',
    loadComponent: () => import('./register/register-student/register-student').then(m => m.RegisterStudentComponent),
    // canActivate:[LoggedInGuard]
  },
  {
    path: 'verify-otp/:userId',
    loadComponent: () => import('./student/verify-otp/verify-otp').then(m => m.VerifyOtpComponent),
    // canActivate:[LoggedInGuard]
  },
  {
    path: 'view-profile',
    loadComponent: () => import('./shared/profile/profile').then(m => m.Profile),
    canActivate:[profileAuthGuardfn]
  },
  {
    path: 'profile-update',
    loadComponent: () => import('./shared/profile-update/profile-update').then(m => m.ProfileUpdateComponent)
  },
  {
    path: 'student',
    loadComponent: () => import('./student/routing/routing').then((m) => m.Routing),
    canActivate: [StudentAuthGuard],
    canActivateChild: [StudentAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./student/student-dashboard/student-dashboard').then((m) => m.StudentDashboardComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./student/s-analytics/s-analytics').then((m) => m.SAnalytics),
      },
      {
        path: 'available-exams',
        loadComponent: () => import('./student/available-exams/available-exams').then((m) => m.AvailableExams),
      },
      {
        path: 'results',
        loadComponent: () => import('./student/results/results.component').then((m) => m.ResultsComponent),
      },
      {
        path:'start-exam/:examId',
        loadComponent: () => import('./exam/start-exam/start-exam').then((m) => m.StartExam),
      },
      {
        path:'review-exam',
        loadComponent: () => import('./exam/review-exam/review-exam').then((m) => m.ReviewExam),
      },
      {
        path:'exam-feedback/:examId',
        loadComponent: () => import('./student/exam-feedback/exam-feedback').then((m) => m.ExamFeedback),
      },
      {
        path:'view-reported-questions',
        loadComponent: () => import('./question/question-feedback/question-feedback').then((m) => m.QuestionFeedback),
      },
      {
        path:'', redirectTo: 'dashboard', pathMatch: 'full'
      }
    ]
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
      {
        path: 'add-questions/:examId',
        loadComponent: () => import('./examiner/add-questions/add-questions').then((m) => m.AddQuestions),
      },
      {
        path: 'manage-questions',
        loadComponent: () => import('./examiner/manage-questions/manage-questions').then((m) => m.ManageQuestions),
      },
      {
        path: 'update-question/:questionId',
        loadComponent: () => import('./examiner/update-question/update-question').then((m) => m.UpdateQuestion),
      },
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
    ],
  },
 
  /*Angular routes are relative to the app's root, not the browser's URL path. So using '/' as a redirect target doesn't work as expected. It may cause infinite redirects or blank pages.
  */
{path: 'admin/dashboard',
   canActivate: [AdminAuthGuard],
   loadComponent: () =>
     import('./admin/dashboard/dashboard').then(m => m.DashboardComponent),
   // 👇 Child routes rendered inside DashboardComponent
   children: [
     {
       path: 'approve-exam',
       loadComponent: () =>
         import('./admin/approve-exam/approve-exam').then(m => m.ApproveExamComponent)
     },
     {
       path: 'approve-topic',
       loadComponent: () =>
         import('./admin/approve-topic/approve-topic').then(m => m.ApproveTopicComponent)
     },
     {
       path: 'reported-questions',
       loadComponent: () =>
         import('./admin/reported-questions/reported-questions').then(m => m.ReportedQuestionsComponent)
     },
     {
       path: 'block-users',
       loadComponent: () =>
         import('./admin/block-user/block-user').then(m => m.BlockUserComponent)
     },
     {
       path: 'exam-feedback',
       loadComponent: () =>
         import('./admin/exam-feedback/exam-feedback').then(m => m.ExamFeedbackComponent)
     },
     { path: '', redirectTo: '', pathMatch: 'full' }
   ]
 },


  { path: '**', redirectTo: '' },
];

