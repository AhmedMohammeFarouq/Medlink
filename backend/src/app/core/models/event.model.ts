export interface EventModel {
  id?: number | string;
  title: string;
  description: string;
  date: string;       // ISO date string
  location: string;
  category: string;
  capacity: number;
  price: number;
}
