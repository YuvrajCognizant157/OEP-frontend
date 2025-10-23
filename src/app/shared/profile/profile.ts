import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { ProfileService } from '../../core/services/profile.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { AuthService } from '../../core/services/auth.service';
import { MatIcon } from "@angular/material/icon";
// Removed Subscription, switchMap, timer

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, MatIcon],
  providers: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;


  private originalProfileData: any;

  private authS = inject(AuthService);
  userId = this.authS.getUserRole()?.id! || 5;

  registrationDate = signal<Date | null>(null);

  constructor(
    private fb: FormBuilder,
    private userService: ProfileService,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.userService.getUserById(this.userId).subscribe(user => {
      // Format dates for the form controls
      this.registrationDate.set(user.registrationDate);
      const formattedDob = this.datePipe.transform(user.dob, 'yyyy-MM-dd');
      const formattedRegDate = this.datePipe.transform(user.registrationDate, 'dd MMM yyyy');


      this.originalProfileData = {
        fullName: user.fullName,
        dob: formattedDob,
        phoneNo: user.phoneNo,
        registrationDate: formattedRegDate,
        role: user.role
      };


      this.profileForm = this.fb.group({
        // Add validators
        fullName: [user.fullName, [Validators.required, Validators.minLength(2)]],
        dob: [formattedDob, Validators.required],
        phoneNo: [user.phoneNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]],

        // Set formatted, disabled values
        registrationDate: [{ value: formattedRegDate, disabled: true }],
        role: [{ value: user.role, disabled: true }]
      });

      this.profileForm.disable();
    });
  }

  enableEdit() {
    this.isEditing = true;
    this.profileForm.enable(); // Enable all...
    // ...then re-disable the ones that should never be edited
    this.profileForm.get('registrationDate')?.disable();
    this.profileForm.get('role')?.disable();
  }

  cancelEdit() {
    // 🔑 FIXED: Reset the form to the captured original data
    this.profileForm.reset(this.originalProfileData);
    this.profileForm.disable();
    this.isEditing = false;
  }

  saveChanges() {
    // Mark all as touched to show errors if user clicks save immediately
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      const formValue = this.profileForm.getRawValue();
      this.userService.updateUser(this.userId, { ...formValue }).subscribe(() => {

        this.originalProfileData = { ...this.originalProfileData, ...formValue };
        this.isEditing = false;
        this.profileForm.disable(); // Disable form again after save

        this.profileForm.get('registrationDate')?.enable();
      this.profileForm.get('role')?.enable();
      this.profileForm.get('registrationDate')?.disable(); // Re-disable to maintain read-only
      this.profileForm.get('role')?.disable();
      });
    } else {
      console.error('Form is invalid');
    }
  }
}