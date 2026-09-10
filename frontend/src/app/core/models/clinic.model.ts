export interface Clinic {
  _id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  operatingHours?: string;
  departments?: string[];
  doctorsCount?: number;
  imageUrl?: string;
}
