export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  roles: string[];
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
