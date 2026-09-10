export interface DoctorReview {
  _id: string;
  patientId: string | any;
  patientName?: string;
  doctorId: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
}
