export interface ProductTcpResponse {
  id: string;
  name: string;
  sku: string;
  unit: string;
  price: number;
  vatRate: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
