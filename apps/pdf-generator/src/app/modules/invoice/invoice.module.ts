import { Module, Provider } from '@nestjs/common';
import { PdfModule } from '../pdf/pdf.module';
import { InvoicePdfTcpController } from './presentation/invoice-pdf-tcp.controller';
import { INVOICE_PDF_SERVICE } from './invoice-pdf.di-tokens';
import { InvoicePdfService } from './application/services/invoice-pdf.service';

const dependencies: Provider[] = [{ provide: INVOICE_PDF_SERVICE, useClass: InvoicePdfService }];

@Module({
  imports: [PdfModule],
  controllers: [InvoicePdfTcpController],
  providers: [...dependencies],
  exports: [],
})
export class InvoiceModule {}
