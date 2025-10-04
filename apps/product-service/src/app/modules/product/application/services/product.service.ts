import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductService, IProductRepository } from '../../interfaces/product.port';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { Product } from '@common/entities/product.entity';

@Injectable()
export class ProductService implements IProductService {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepo: IProductRepository) {}
  async create(data: Partial<Product>): Promise<Product> {
    const { sku, name } = data;
    const exists = await this.productRepo.exists(sku, name);
    if (exists) {
      throw new BadRequestException('Product with the same SKU or name already exists');
    }
    return this.productRepo.create(data);
  }

  async getList(): Promise<Product[]> {
    return this.productRepo.findAll();
  }
}
