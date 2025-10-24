import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordReset } from '../../core/services/password-reset';

// Import necessary standalone modules
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Custom validator for matching passwords
export function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  private fb = inject(FormBuilder);
  private passwordResetService = inject(PasswordReset);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  currentStep = signal(1); // 1 for email, 2 for OTP/password
  isLoading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  userEmail = signal(''); // To store email for step 2

  resetForm!: FormGroup;

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verifyEmail: [true, [Validators.required]],
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatcher });

    // 3. effect() reacts to state changes automatically
    // This replaces ngOnInit and updateFormControls()
    effect(() => {
      const step = this.currentStep();
      if (step === 1) {
        this.resetForm.get('email')?.enable();
        this.resetForm.get('verifyEmail')?.enable();
        this.resetForm.get('otp')?.disable();
        this.resetForm.get('newPassword')?.disable();
        this.resetForm.get('confirmPassword')?.disable();
      } else {
        this.resetForm.get('email')?.disable();
        this.resetForm.get('verifyEmail')?.disable();
        this.resetForm.get('otp')?.enable();
        this.resetForm.get('newPassword')?.enable();
        this.resetForm.get('confirmPassword')?.enable();
      }
    });
  }

  requestOtp(): void {
    if (this.resetForm.get('email')?.invalid || this.resetForm.get('verifyEmail')?.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.userEmail.set(this.resetForm.get('email')?.value);
    const verifyWithEmail = this.resetForm.get('verifyEmail')?.value;

    this.passwordResetService.requestOtp(this.userEmail(), verifyWithEmail).subscribe({
      next: (response:any) => {
        this.isLoading.set(false);
        this.currentStep.set(2); // The effect() will handle the form
        console.log("OTP: ",response.otp);
        let message = 'OTP request successful. ';
        if (verifyWithEmail) {
          message += 'Please check your email.';
        } else {
          message += 'OTP logged (for testing).';
        }
        this.openSnackBar(message, 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.openSnackBar(err.error?.message || 'Email not found.', 'error');
      }
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { otp, newPassword } = this.resetForm.value;
    // Use signal value with ()
    this.passwordResetService.resetPassword(this.userEmail(), Number(otp), newPassword).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.openSnackBar('Password reset successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate to login page
        }, 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.openSnackBar(err.error?.message || 'Invalid OTP or error resetting password.', 'error');
      }
    });
  }

  backToEmail(): void {
    this.currentStep.set(1);
    this.userEmail.set('');
    this.resetForm.get('otp')?.reset();
    this.resetForm.get('newPassword')?.reset();
    this.resetForm.get('confirmPassword')?.reset();
    // The effect() will run automatically
  }

  // Helper methods to toggle signals from the template
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  openSnackBar(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  

}
