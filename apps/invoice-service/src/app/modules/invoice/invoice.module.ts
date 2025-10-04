import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { INVOICE_REPOSITORY, INVOICE_SERVICE } from './invoice.di-tokens';
import { InvoiceService } from './application/services/invoice.service';
import { InvoiceMongoRepository } from './infrastructure/invoice-mongo.repo';
import { InvoiceTcpController } from './presentation/invoice-tcp.controller';
import { MongoProvider } from '@common/configuration/mongo.config';

const dependencies: Provider[] = [
  { provide: INVOICE_SERVICE, useClass: InvoiceService },
  { provide: INVOICE_REPOSITORY, useClass: InvoiceMongoRepository },
];

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceTcpController],
  providers: [...dependencies],
})
export class InvoiceModule {}
