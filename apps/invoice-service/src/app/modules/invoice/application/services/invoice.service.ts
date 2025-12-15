import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IInvoiceRepository, IInvoiceService } from '../ports/invoice.port';
import { INVOICE_EVENT_PUBLISHER, INVOICE_REPOSITORY, SEND_INVOICE_SAGA_COORDINATOR } from '../../invoice.di-tokens';
import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { ObjectId } from 'mongodb';
import { IInvoiceEventPublisher } from '../ports/invoice.port';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: IInvoiceRepository,
    @Inject(INVOICE_EVENT_PUBLISHER) private readonly invoiceEventPublisher: IInvoiceEventPublisher,
  ) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTcpReq, processId: string) {
    const { invoiceId, userId } = params;

    const invoice = await this.invoiceRepository.getById(invoiceId);
    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
    }

    //update invoice status to PROCESSING
    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.PROCESSING,
      supervisorId: new ObjectId(userId),
    });

    //emit event to kafka for process
    this.invoiceEventPublisher.publishInvoiceProcessSendEvent({
      invoiceId,
      userId,
      processId,
    });
  }

  async updateInvoicePaid(invoiceId: string) {
    const invoice = await this.invoiceRepository.getById(invoiceId);
    if (!invoice) {
      throw new NotFoundException(ERROR_CODE.INVOICE_NOT_FOUND);
    }

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.PAID,
    });

    return invoiceId;
  }

  getById(id: string) {
    return this.invoiceRepository.getById(id);
  }
}
