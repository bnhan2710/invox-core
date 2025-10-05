import { Product } from '@common/entities/product.entity';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';

export interface IProductService {
  create(data: CreateProductTcpRequest): Promise<Product>;
  getList(): Promise<Product[]>;
}

export interface IProductRepository {
  create(data: Partial<Product>): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: string, data: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<void>;
  exists(sku: string, name: string): Promise<boolean>;
}
