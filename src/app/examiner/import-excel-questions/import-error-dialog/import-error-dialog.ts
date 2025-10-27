import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

// Interface for the data passed into this dialog
interface ImportResultError {
  RowNumber: number;
  Message: string;
}

interface DialogData {
  errors: ImportResultError[];
}

@Component({
  selector: 'app-import-error-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './import-error-dialog.html',
  styleUrls: ['./import-error-dialog.css']
})
export class ImportErrorDialog implements OnInit {

  // Data source for the Material Table
  dataSource: ImportResultError[] = [];
  
  // Columns to display in the table
  displayedColumns: string[] = ['rowNumber', 'message'];
  
  // Total number of errors
  totalErrors: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ImportErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.errors) {
      console.log('Import errors received in dialog:', this.data);
      
      this.dataSource = this.data.errors;
      this.totalErrors = this.data.errors.length;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}