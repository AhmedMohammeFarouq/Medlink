import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRole } from '../constants/roles';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as AppRole[];
  const userRole = authService.userRole();

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // If unauthorized for this specific role, redirect to appropriate role dashboard
  const fallback = authService.getDashboardRouteForRole(userRole);
  router.navigate([fallback]);
  return false;
};
