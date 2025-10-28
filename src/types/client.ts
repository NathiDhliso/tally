export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  lastUsed: Date;
  usageCount: number;
  createdAt: Date;
}
