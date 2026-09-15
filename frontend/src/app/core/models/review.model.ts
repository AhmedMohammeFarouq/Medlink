export type ReviewStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED';

export interface DoctorReview {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewDto {
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  status?: ReviewStatus;
}

export interface ReviewFilters {
  doctorId?: string;
  patientId?: string;
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}
