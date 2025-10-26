import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReviewExamComponent } from '../review-exam/review-exam';
@Component({
 selector: 'app-approve-exam',
 standalone: true,
 imports:[CommonModule,MatSnackBarModule,RouterModule],
 templateUrl: './approve-exam.html',
 styleUrls: ['./approve-exam.css']
})
export class ApproveExamComponent implements OnInit {
 exams: any[] = [];
 userId!: number;
 loading = false;
 constructor(private adminService: AdminService, private snack: MatSnackBar, private router: Router,private route:ActivatedRoute) {}
 ngOnInit(): void {
   const storedId = localStorage.getItem('userId');
   if (storedId) this.userId = Number(storedId);
   this.loadAssignedExams(this.userId);
 }
 loadAssignedExams(adminId:number): void {

  if (!this.userId) {

    this.snack.open('Admin ID missing. Please log in again.', 'Close', { duration: 3000 });

    return;

  }

  this.loading = true;

  this.adminService.getAssignedExams(adminId).subscribe({

    next: (res) => {

      this.exams = Array.isArray(res) ? res : res.ExamList || res.examList || [];

      this.loading = false;

      if (!this.exams.length) {

        this.snack.open('No exams to be approved', 'Close', { duration: 2500 });

      }

    },

    error: (err) => {

      console.error(err);

      this.loading = false;

      this.snack.open('Error loading exams', 'Close', { duration: 3000 });

    }

  });

}
 
 openExam(examId: number) {
  console.log('Clicked exam id',examId);
   this.router.navigate(['/admin/dashboard/review-exam', examId]);
 }
}