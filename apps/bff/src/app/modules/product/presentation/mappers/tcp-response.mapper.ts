import { ProductResponseDto } from '@common/interfaces/gateway/product';
import { ProductTcpResponse } from '@common/interfaces/tcp/product';

export function mapTcpToHttp(dto: ProductTcpResponse): ProductResponseDto {
  return {
    id: dto.id,
    name: dto.name || '',
    sku: dto.sku || '',
    unit: dto.unit || '',
    price: dto.price || 0,
    vatRate: dto.vatRate || 0,
    createdAt: dto.createdAt || undefined,
    updatedAt: dto.updatedAt || undefined,
  };
}
