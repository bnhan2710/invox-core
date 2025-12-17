import { Injectable } from '@nestjs/common';
import { IInvoiceEventPublisher } from '../../../application/ports/invoice.port';
import { KafkaService } from '@common/kafka/kafka.service';
import { InvoiceProcessPayload, InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { INVOICE_EVENTS } from '@common/constants/enum/event/event.enum';

@Injectable()
export class InvoiceKafkaPublisher implements IInvoiceEventPublisher {
  constructor(private readonly kafkaClient: KafkaService) {}
  publishInvoiceProcessSendEvent(payload: InvoiceProcessPayload) {
    this.kafkaClient.emit<InvoiceProcessPayload>(INVOICE_EVENTS.INVOICE_PROCESS_SEND_EVENT, payload);
  }
  publishInvoiceSentEvent(payload: InvoiceSentPayload) {
    this.kafkaClient.emit<InvoiceSentPayload>(INVOICE_EVENTS.INVOICE_SENT, payload);
  }
}
