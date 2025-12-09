import { Controller, Inject } from '@nestjs/common';
import { INVOICE_SERVICE } from '../../invoice.di-tokens';
import { IInvoiceService } from '../../application/ports/invoice.port';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoiceProcessPayload } from '@common/interfaces/queue/invoice';

@Controller()
export class InvoiceProcessKafkaConsumer {
  constructor(
    @Inject(INVOICE_SERVICE)
    private readonly invoiceService: IInvoiceService,
  ) {}

  @MessagePattern('invoice_process_send')
  async handleInvoiceProcess(@Payload() payload: InvoiceProcessPayload) {
    const { invoiceId, processId } = payload;
    await this.invoiceService.processInvoiceSend(invoiceId, processId);
  }
}
