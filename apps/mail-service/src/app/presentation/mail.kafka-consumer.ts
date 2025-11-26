import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller()
export class MailKafkaConsumer {
  @EventPattern('invoice_sent')
  async handleInvoiceSentEvent(@Payload() payload, @Ctx() context: KafkaContext) {
    Logger.debug(`Received invoice_sent event with payload:${payload} and context:${context}`);
  }
}
