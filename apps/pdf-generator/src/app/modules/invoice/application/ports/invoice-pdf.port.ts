export interface IInvoicePdfService {
  generateInvoicePdf(data: any): Promise<Buffer>;
}
