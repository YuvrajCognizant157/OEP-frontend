import { Routes } from '@angular/router';
import { StudentAuthGuard } from './auth/student-auth.guard';
import {  examinerAuthGuardFn } from './auth/examiner-auth.guard';
import { Home } from './home/home';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { BlockUserComponent } from './admin/block-user/block-user';
import {ApproveTopicComponent} from './admin/approve-topic/approve-topic';
import {ApproveExamComponent} from './admin/approve-exam/approve-exam';
//import {ApproveQuestion} from './admin/Reported-Questions/approve-question';
import {ExamFeedbackComponent} from './admin/exam-feedback/exam-feedback';
//import { AdminComponent } from './admin/admin.component';
import { ReviewExamComponent } from './admin/review-exam/review-exam';
import { ReportedQuestionsComponent } from './admin/reported-questions/reported-questions';
import { ReviewQuestionComponent } from './admin/review-question/review-question';

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
    path: 'student/results',
    loadComponent: () =>
      import('./student/results/results.component').then((m) => m.ResultsComponent),
  
    canActivate: [StudentAuthGuard],
  },
  {
    path: 'student/analytics',
    loadComponent: () =>
      import('./student/s-analytics/s-analytics').then((m) => m.SAnalytics),
    canActivate: [StudentAuthGuard],
  },
   {
    path: 'student/available-exams',
    loadComponent: () =>
      import('./student/available-exams/available-exams').then((m) => m.AvailableExams),
    canActivate: [StudentAuthGuard]
  },
   {
    path: 'student/start-exam/:examId',
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
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
    ],
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
        component: ApproveExamComponent
      },
      
      {
        path: 'approve-topic',
        component: ApproveTopicComponent
      },
      {
      path:'review-exam',
      component:ReviewExamComponent
      },
      {
        path: 'block-users',
        component: BlockUserComponent
      },
      {
        path: 'exam-feedback',
        component: ExamFeedbackComponent
      },
      {
        path: 'reported-questions',
        component:ReportedQuestionsComponent
      },
      {
        path:'review-question',
        component:ReviewQuestionComponent
      }
    ]
  },

  { path: '**', redirectTo: '' },
];

