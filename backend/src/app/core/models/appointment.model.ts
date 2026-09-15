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
  cancellationReason?: string;
  cancelledAt?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookAppointmentDto {
  doctorId: string;
  clinicId?: string;
  scheduledAt: string | Date;
  type?: AppointmentType;
  reason?: string;
}
