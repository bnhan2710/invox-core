import { Product } from '../../domain';
import { ProductEntity } from '../persistence/entities/product.orm-entity';
import { SKU } from '../../domain';
import { Price } from '../../domain';

export class ProductMapper {
  static toDomain(row: ProductEntity): Product {
    return new Product(
      row.id,
      row.name,
      SKU.create(row.sku),
      row.unit,
      Price.create(row.price),
      row.vatRate,
      row.description,
    );
  }

  static toPersistence(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.sku = domain.sku.getValue();
    entity.unit = domain.unit;
    entity.price = domain.price.getAmount();
    entity.vatRate = domain.vatRate;
    entity.description = domain.description;
    return entity;
  }
}
