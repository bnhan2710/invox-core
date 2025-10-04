import { Inject, Injectable } from '@nestjs/common';
import { IInvoiceRepository, IInvoiceService } from '../../interfaces/invoice.port';
import { INVOICE_REPOSITORY } from '../../invoice.di-tokens';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../../mappers';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(@Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: IInvoiceRepository) {}
  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }
}
