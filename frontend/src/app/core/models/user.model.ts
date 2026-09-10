import { AppRole } from '../constants/roles';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED';
export type UserGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: AppRole;
  status: UserStatus;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileImage?: string | null;
  gender?: UserGender;
  dateOfBirth?: string | Date;
  lastLoginAt?: string | Date;
  lastLoginIp?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: UserGender;
  dateOfBirth?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
