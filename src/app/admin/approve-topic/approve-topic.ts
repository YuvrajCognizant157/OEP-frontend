import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import { ApproveTopic } from '../../shared/models/approve-topic.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
@Component({
 selector: 'app-approve-topic',
 standalone: true,
 imports: [CommonModule, FormsModule, MatSnackBarModule, MatButtonModule, MatTableModule, MatCardModule],
 templateUrl: './approve-topic.html',
 styleUrls: ['./approve-topic.css']
})
export class ApproveTopicComponent implements OnInit {
 topics: any[] = [];
 loading = false;
 userId!: number;
 displayedColumns: string[] = ['tid', 'subject', 'actions'];
 constructor(private adminService: AdminService, private snack: MatSnackBar) {}
 ngOnInit(): void {
   const storedId = localStorage.getItem('userId');
   if (storedId) {
     this.userId = Number(storedId);
     console.log('Admin ID from localStorage:', this.userId);
   } else {
     this.snack.open('User ID not found in localStorage', 'close', { duration: 3000 });
   }
 }
 loadTopics(): void {
   if (!this.userId) {
     this.snack.open('User ID missing. Please log in again.', 'close', { duration: 3000 });
     return;
   }
   this.loading = true;
   this.adminService.getTopicsForApproval(this.userId).subscribe({
     next: (res: any) => {
       console.log('Topics received:', res);
       // adjust based on API structure
       this.topics = res.topics || res;
       this.loading = false;
     },
     error: (err) => {
       console.error('Error loading topics:', err);
       this.loading = false;
       this.snack.open('Error loading topics', 'close', { duration: 3000 });
     }
   });
 }
 approveTopic(topicId: number): void {
   this.adminService.approveOrRejectTopic(topicId, this.userId).subscribe({
     next: () => {
       this.snack.open('Topic approved successfully!', 'close', { duration: 3000 });
       this.loadTopics();
     },
     error: () => {
       this.snack.open('Error while approving topic', 'close', { duration: 3000 });
     }
   });
 }
 rejectTopic(topicId: number): void {
   this.adminService.approveOrRejectTopic(topicId, this.userId).subscribe({
     next: () => {
       this.snack.open('Topic rejected successfully!', 'close', { duration: 3000 });
       this.loadTopics();
     },
     error: () => {
       this.snack.open('Error while rejecting topic', 'close', { duration: 3000 });
     }
   });
 }
}