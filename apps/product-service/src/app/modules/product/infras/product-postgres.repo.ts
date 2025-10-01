import { Product } from '@common/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../interfaces/product.port';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductPostgresRepository implements IProductRepository {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async exists(sku: string, name: string): Promise<boolean> {
    const count = await this.repo.findOne({ where: [{ sku }, { name }] });
    return !!count;
  }
}
