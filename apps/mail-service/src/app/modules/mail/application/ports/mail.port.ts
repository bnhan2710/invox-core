import { SendMailOptions } from '@common/interfaces/common';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';

export interface IMailService {
  sendMail(options: SendMailOptions): Promise<void>;
}

export interface IMailInvoiceService {
  sendInvoice(payload: InvoiceSentPayload);
  getInvoiceById(id: string);
}
