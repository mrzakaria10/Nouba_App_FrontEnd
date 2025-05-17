export interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  poster?: string;
  posterFile?: File;
  password?: string;
 city: {
    id: number;
    name: string;
  };
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
