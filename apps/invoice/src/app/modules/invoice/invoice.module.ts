import { MongoProvider } from '@common/configuration/mongo.config';
import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { INVOICE_REPOSITORY, INVOICE_SERVICE } from './invoice.di-tokens';
import { InvoiceService } from './services/invoice.service';
import { InvoiceMongoRepository } from './infras/invoice-mongo.repo';
import { InvoiceHttpController } from './infras/invoice-http.controller';

const dependencies: Provider[] = [
  { provide: INVOICE_SERVICE, useClass: InvoiceService },
  { provide: INVOICE_REPOSITORY, useClass: InvoiceMongoRepository },
];

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceHttpController],
  providers: [...dependencies],
})
export class InvoiceModule {}
