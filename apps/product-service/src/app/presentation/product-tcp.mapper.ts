import { Product } from '../domain/entities/product.entity';
import { ProductTcpResponse } from '@common/interfaces/tcp/product';

export class ProductTcpMapper {
  static toResponse(product: Product): ProductTcpResponse {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku.getValue(),
      unit: product.unit,
      price: product.price.getAmount(),
      vatRate: product.vatRate,
      description: product.description,
    };
  }
}
