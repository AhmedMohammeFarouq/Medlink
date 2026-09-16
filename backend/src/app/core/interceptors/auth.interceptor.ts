import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Endpoints that must NOT get an Authorization header attached
// (avoids sending a stale/expired token to the login or refresh calls themselves).
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/refresh'];

// Shared across all requests going through this interceptor instance so that
// concurrent 401s only trigger a single refresh call, and every queued
// request waits for it and retries with the new token.
let isRefreshing = false;
const refreshedTokenSubject = new BehaviorSubject<string | null>(null);

function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function addToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) {
    return request;
  }
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  // Public endpoints (login/refresh) go out untouched.
  if (isPublicEndpoint(request.url)) {
    return next(request);
  }

  const authorizedRequest = addToken(request, authService.getAccessToken());

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return handle401(authorizedRequest, next, authService);
    })
  );
};

function handle401(
  request: HttpRequest<unknown>,
  next: Parameters<HttpInterceptorFn>[1],
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshedTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshedTokenSubject.next(response.accessToken);
        return next(addToken(request, response.accessToken));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  }

  // A refresh is already in progress: wait for it to finish, then retry
  // this request with the freshly issued token instead of firing a second refresh.
  return refreshedTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addToken(request, token)))
  );
}
