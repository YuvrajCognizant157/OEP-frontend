import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const LoggedInGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const tokenInStorage = localStorage.getItem("token");


  // 1. Check if there is a pending user in the service
  // 2. Check if the pending ID matches the ID in the URL
  if (tokenInStorage) {
    // If they match,do not allow access
    router.navigate(['/'])
    return false; 
  }

  // If there's no pending ID or the IDs don't match,
  // block access and redirect to the registration page.
  router.navigate(['/login']);
  return true;
};