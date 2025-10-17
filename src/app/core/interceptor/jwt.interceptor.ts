import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs'; // Import EMPTY
import { AuthService } from '../services/auth.service';

export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 2. Get the expiration timestamp (exp is in seconds, Date.now() is in milliseconds)
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();

    // 3. Check if the token is expired
    if (expirationDate <= now) {
      console.log('JWT Token has expired. Logging out.');
      authService.logout();
      return EMPTY; // Stops the request from proceeding
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};