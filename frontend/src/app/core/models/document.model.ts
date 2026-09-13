export interface MedicalDocument {
  _id: string;
  patientId: string | any;
  uploadedBy: string | any;
  title: string;
  type: 'LAB_REPORT' | 'IMAGING' | 'DISCHARGE_SUMMARY' | 'INSURANCE' | 'ID_PROOF' | 'OTHER';
  fileUrl: string;
  fileSizeMb?: number;
  uploadedDate: string | Date;
  notes?: string;
  createdAt?: string;
}
