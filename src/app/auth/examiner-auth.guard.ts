import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';


export const examinerAuthGuardFn: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUserRole();
  if (authService.isLoggedIn() && user?.role === 'Examiner') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
