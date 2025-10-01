import { TypeOrmProvider } from '@common/configuration/typeorm.config';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@common/entities/product.entity';
import { PRODUCT_REPOSITORY, PRODUCT_SERVICE } from './product.di-tokens';
import { ProductService } from './services/product.service';
import { ProductPostgresRepository } from './infras/product-postgres.repo';
import { ProductTcpController } from './infras/product-tcp.controller';

const dependencies: Provider[] = [
  { provide: PRODUCT_SERVICE, useClass: ProductService },
  { provide: PRODUCT_REPOSITORY, useClass: ProductPostgresRepository },
];

@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  controllers: [ProductTcpController],
  providers: [...dependencies],
  exports: [],
})
export class ProductModule {}
