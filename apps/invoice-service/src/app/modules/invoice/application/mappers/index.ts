import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';

export const invoiceRequestMapping = (data: CreateInvoiceTcpRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((acc, item) => acc + item.total, 0),
    vatAmount: data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity * item.vatRate) / 100, 0),
  };
};

export const createSessionMapping = (invoice: Invoice) => {
  return {
    invoiceId: invoice.id,
    clientEmail: invoice.client.email,
    lineItems: invoice.items.map((item) => ({
      price: item.total,
      quantity: item.quantity,
      name: item.name,
    })),
  };
};
