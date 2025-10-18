import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-add-remark-dialog',

  standalone: true,

  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule,MatDialogContent, MatDialogActions],

  template: `
<h2 mat-dialog-title>Add Remark for Exam #{{ data.examId }}</h2>
<mat-dialog-content>
<mat-form-field appearance="outline" style="width: 100%;">
<mat-label>Enter Remark</mat-label>
<textarea matInput rows="3" [(ngModel)]="remark"></textarea>
</mat-form-field>
</mat-dialog-content>
<mat-dialog-actions align="end">
<button mat-button mat-dialog-close>Cancel</button>
<button mat-raised-button color="primary" [mat-dialog-close]="remark">Save</button>
</mat-dialog-actions>

  `

})

export class AddRemarkDialog {

  remark: string = '';

  constructor(public dialogRef: MatDialogRef<AddRemarkDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}

}
 