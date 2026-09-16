export interface MedicalDocument {
  _id: string;
  patientId: string | any;
  uploadedBy: string | any;
  title: string;
  type: 'LAB_REPORT' | 'LAB_RESULT' | 'MEDICAL_REPORT' | 'IMAGING' | 'PRESCRIPTION' | 'MEDICAL_CERTIFICATE' | 'DISCHARGE_SUMMARY' | 'INSURANCE' | 'IDENTITY' | 'ID_PROOF' | 'OTHER';
  fileUrl: string;
  fileSizeMb?: number;
  uploadedDate: string | Date;
  notes?: string;
  createdAt?: string;
}
