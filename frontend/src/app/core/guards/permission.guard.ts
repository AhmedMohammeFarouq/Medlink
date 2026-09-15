import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles';
import { AppPermission } from '../constants/permissions';

// NOTE: Not currently wired into any route. The frontend has no source of
// per-user granted permissions yet (User model only carries `role`), so this
// guard can only gate on route-declared `data.permissions` today. If/when the
// backend starts returning a permissions list on the authenticated user,
// swap the `hasAny` check below to read from that instead of allowing all
// non-SYSTEM_ADMIN roles through.
export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // System admin always has full permissions.
  if (authService.userRole() === ROLES.SYSTEM_ADMIN) {
    return true;
  }

  const requiredPermissions = route.data?.['permissions'] as AppPermission[] | undefined;
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // No granular permission source is currently exposed on the User model,
  // so a route requiring specific permissions cannot yet be satisfied by a
  // non-admin user. Fail closed rather than silently granting access.
  router.navigate([authService.getDashboardRouteForRole()]);
  return false;
};
