export type InvoiceSentPayload = {
  id: string;
  paymentLink: string;
};

export type InvoiceProcessPayload = {
  invoiceId: string;
  userId: string;
  processId: string;
};
