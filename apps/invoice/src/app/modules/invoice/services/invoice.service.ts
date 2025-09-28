import { Injectable } from '@nestjs/common';
import { IInvoiceService } from '../interfaces/invoice.port';

@Injectable()
export class InvoiceService implements IInvoiceService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
