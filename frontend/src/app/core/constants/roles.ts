export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  CLINIC_ADMIN: 'CLINIC_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN'
} as const;

export type AppRole = typeof ROLES[keyof typeof ROLES];
export type UserRole = AppRole;
