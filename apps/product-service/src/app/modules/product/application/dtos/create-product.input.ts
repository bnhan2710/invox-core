export interface CreateProductInput {
  name: string;
  description?: string;
  sku: string;
  unit: string;
  price: number;
  vatRate: number;
}
