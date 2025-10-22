import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const verifyOtpGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the user ID from the service (set during registration)
  const pendingUserId = authService.pendingVerificationUserId();

  // Get the user ID from the URL we're trying to access
  const routeUserId = +route.params['userId'];

  // 1. Check if there is a pending user in the service
  // 2. Check if the pending ID matches the ID in the URL
  if (pendingUserId !== null && pendingUserId === routeUserId) {
    // If they match, allow access
    return true; 
  }

  // If there's no pending ID or the IDs don't match,
  // block access and redirect to the registration page.
  router.navigate(['/register']);
  return false;
};