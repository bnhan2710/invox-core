import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MAIL_INVOICE_SERVICE } from '../mail.di-tokens';
import { IMailInvoiceService } from '../application/ports/mail.port';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { INVOICE_EVENTS } from '@common/constants/enum/event/event.enum';

@Controller()
export class MailKafkaConsumer {
  @Inject(MAIL_INVOICE_SERVICE) private readonly mailInvoiceService: IMailInvoiceService;

  @EventPattern(INVOICE_EVENTS.INVOICE_SENT)
  async invoiceSentEvent(@Payload() payload: InvoiceSentPayload) {
    await this.mailInvoiceService.sendInvoice(payload);
  }
}
