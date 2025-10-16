import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface Topic {
  approvalStatus: number;
  approvedByUser: any;
  approvedByUserId: number;
  questions: any[];
  subject: string;
  submittedForApproval: boolean;
  tid: number;
}

@Component({
  selector: 'app-topic-dialog',
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './topic-dialog.html',
  styleUrl: './topic-dialog.css',
})
export class TopicDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public topic: Topic) {}
}
