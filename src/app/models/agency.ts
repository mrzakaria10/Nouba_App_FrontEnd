export interface Agency {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  cityId: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
