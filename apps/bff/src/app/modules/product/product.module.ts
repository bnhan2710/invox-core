import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductHttpController } from './presentation/product-http.controller';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.PRODUCT_SERVICE)])],
  controllers: [ProductHttpController],
  providers: [],
})
export class ProductModule {}
