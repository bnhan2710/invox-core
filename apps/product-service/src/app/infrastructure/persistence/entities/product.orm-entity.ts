import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  unit: string;

  @Column('float')
  price: number;

  @Column('float')
  vatRate: number;

  @Column({ nullable: true })
  description?: string;
}
