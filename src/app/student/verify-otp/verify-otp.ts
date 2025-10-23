import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule,FormsModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpForm: FormGroup;
  userId!: number;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  allowSuccessMail : boolean =false;

  // Resend timer
  resendCooldown = 60; // Cooldown in seconds
  canResend = false;
  private timerSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]] // Assuming a 6-digit OTP
    });
  }

  ngOnInit(): void {
    // Get the userId from the URL parameter
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.userId = +params['userId'];
      if (!this.userId) {
        // If no ID, redirect to login
        this.router.navigate(['/login']);
      }
    });

    this.startResendTimer();
  }

  startResendTimer(): void {
    this.canResend = false;
    this.resendCooldown = 60;
    
    this.timerSubscription?.unsubscribe(); // Unsubscribe from any existing timer

    this.timerSubscription = timer(0, 1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.resendCooldown > 0) {
        this.resendCooldown--;
      } else {
        this.canResend = true;
        this.timerSubscription.unsubscribe();
      }
    });
  }

  onVerify(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const otpValue = this.otpForm.get('otp')?.value;

    this.authService.verifyOTP(this.userId, Number(otpValue),this.allowSuccessMail).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = "Verification successful! Redirecting to login...";
        // Navigate to login after a short delay
        this.authService.pendingVerificationUserId.set(null);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || "An unknown error occurred."; // 'err.error' holds the "Incorrect OTP!!" string
        this.authService.pendingVerificationUserId.set(null);
      }
    });
  }

  onResend(): void {
    if (!this.canResend) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.resendOTP(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.msg; // "OTP Resent Successfully"
        this.startResendTimer(); // Restart the timer
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || "Failed to resend OTP.";
        this.canResend = true; // Allow them to try again if it failed
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}