import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';

export interface IInvoiceRepository {
  create(data: Partial<Invoice>);
  getById(id: string): Promise<Invoice | null>;
  updateById(id: string, data: Partial<Invoice>): Promise<Invoice | null>;
  deleteById(id: string): Promise<Invoice | null>;
}

export interface IInvoiceService {
  create(params: CreateInvoiceTcpRequest);
  sendById(params: SendInvoiceTcpReq, processId: string);
  generatorInvoicePdf(data: Invoice, processId: string);
  uploadFile(data: UploadFileTcpReq, processId: string);
}
