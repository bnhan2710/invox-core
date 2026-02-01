import { Product } from '../../domain';

export interface ProductSummaryDto {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
}

export interface ProductDetailDto {
  id: string;
  name: string;
  description?: string;
  sku: string;
  unit: string;
  price: number;
  vatRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPriceDto {
  id: string;
  sku: string;
  basePrice: number;
  vatRate: number;
  currency: string;
}

export class ProductDtoMapper {
  static toSummary(product: Product): ProductSummaryDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku.getValue(),
      price: product.price.getAmount(),
      unit: product.unit,
    };
  }

  static toDetail(product: Product): ProductDetailDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      unit: product.unit,
      price: product.price.getAmount(),
      vatRate: product.vatRate,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toPrice(product: Product): ProductPriceDto {
    return {
      id: product.id,
      sku: product.sku.getValue(),
      basePrice: product.price.getAmount(),
      vatRate: product.vatRate,
      currency: 'VND',
    };
  }
}
