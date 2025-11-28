import { Controller, Inject, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { MAIL_SERVICE } from '../mail.di-tokens';
import { IMailService } from '../application/ports/mail.port';

@Controller()
export class MailKafkaConsumer {
  @Inject(MAIL_SERVICE) private readonly mailService: IMailService;

  @EventPattern('invoice_sent')
  async handleInvoiceSentEvent(
    @Payload() payload: { invoiceId: string; clientEmail: string },
    @Ctx() context: KafkaContext,
  ) {
    Logger.debug(`Received invoice_sent event with payload:${payload} and context:${context}`);
    this.mailService.sendMail({
      subject: 'Mail invoice',
      to: payload.clientEmail,
      text: `Invoice: ${payload.invoiceId}`,
    });
  }
}
