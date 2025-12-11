import { Injectable } from '@nestjs/common';
import { IInvoiceEventPublisher } from '../../../application/ports/invoice.port';
import { KafkaService } from '@common/kafka/kafka.service';
import { InvoiceProcessPayload, InvoiceSentPayload } from '@common/interfaces/queue/invoice';

@Injectable()
export class InvoiceKafkaPublisher implements IInvoiceEventPublisher {
  constructor(private readonly kafkaClient: KafkaService) {}
  publishInvoiceProcessSendEvent(payload: InvoiceProcessPayload) {
    this.kafkaClient.emit<InvoiceProcessPayload>('invoice_process_send', payload);
  }
  publishInvoiceSentEvent(payload: InvoiceSentPayload) {
    this.kafkaClient.emit<InvoiceSentPayload>('invoice_sent', payload);
  }
}
