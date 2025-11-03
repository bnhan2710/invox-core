import { Inject, Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { IPdfService } from '../../../pdf/application/ports/pdf.port';
import { PDF_SERVICE } from '../../../pdf/pdf.di-tokens';
import { Invoice } from '@common/schemas/invoice.schema';

@Injectable()
export class InvoicePdfService {
  constructor(@Inject(PDF_SERVICE) private readonly pdfService: IPdfService) {}

  async generateInvoicePdf(invoice: Invoice): Promise<Uint8Array<ArrayBufferLike>> {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');
    const subtotal = invoice.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    const data = {
      client: invoice.client,
      status: invoice.status,
      items: invoice.items,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount,
      subtotal,
    };

    return this.pdfService.generatePdfFromEjs(templatePath, data);
  }
}
