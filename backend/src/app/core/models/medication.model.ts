export interface Medication {
  _id: string;
  name: string;
  genericName?: string;
  form?: string;
  strength?: string;
  manufacturer?: string;
  description?: string;
}
