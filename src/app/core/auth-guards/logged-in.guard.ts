import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const LoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenInStorage = localStorage.getItem("token");

  if (tokenInStorage) {
    // If user is already logged in, prevent access to login/register pages
    router.navigate(['/']);
    return false;
  }

  // Otherwise, allow access (for first-time login etc.)
  return true;
};