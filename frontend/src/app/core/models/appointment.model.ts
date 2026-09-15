import { AppointmentStatus } from '../constants/appointment-status';

export type AppointmentType = 'IN_PERSON' | 'ONLINE' | 'FOLLOW_UP';

export interface Appointment {
  _id: string;
  patientId: string | any;
  doctorId: string | any;
  clinicId?: string | any;
  scheduledAt: string | Date;
  duration?: number;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  cancellation?: AppointmentCancellation;
  createdAt?: string;
  updatedAt?: string;
}
export interface AppointmentCancellation {
  cancelledBy?: string | null;
  cancelledAt?: string | Date | null;
  reason?: string | null;
}
export interface BookAppointmentDto {
  doctorId: string;
  clinicId?: string;
  scheduledAt: string | Date;
  type?: AppointmentType;
  reason?: string;
}
