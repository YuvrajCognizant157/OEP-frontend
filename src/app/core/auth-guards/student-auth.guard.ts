import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path if needed

// Export a constant function, not a class
export const StudentAuthGuard: CanActivateFn = () => {
  // Use 'inject' to get dependencies in a functional guard
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getUserRole()?.role === 'Student') {
    return true;
  }
  
  // Navigate and return false if the guard fails
  router.navigate(['/login']);
  return false;
};