import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({

  selector: 'app-add-remark-dialog',
  standalone:true,

  imports:[CommonModule,FormsModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],

  templateUrl: './add-remark-dialog.html',

  styleUrls: ['./add-remark-dialog.css'],

})

export class AddRemarkDialogComponent {

  remarkForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<AddRemarkDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.remarkForm = this.fb.group({

      remark: ['', [Validators.required, Validators.minLength(3)]],

    });

  }

  // ✅ Submit remark

  submit(): void {

    if (this.remarkForm.invalid) return;

    this.dialogRef.close(this.remarkForm.value.remark);

  }

  // ❌ Cancel dialog

  cancel(): void {

    this.dialogRef.close();

  }

}
 