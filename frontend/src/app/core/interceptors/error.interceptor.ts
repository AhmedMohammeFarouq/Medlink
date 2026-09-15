import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageUtil } from '../utils/storage.util';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          errorMessage = error.error.errors.join(', ');
        }
      }

      // Handle 401 Unauthorized
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
        StorageUtil.clearAuth();
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      }

      // Return unified error structure
      return throwError(() => ({
        status: error.status,
        statusText: error.statusText,
        message: errorMessage,
        raw: error
      }));
    })
  );
};
