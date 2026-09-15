export interface ChatUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
}

export interface ChatRoom {
  _id: string;
  patientId: ChatUser;
  doctorId: ChatUser;
  appointmentId: string | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}