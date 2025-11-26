import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IInvoiceRepository, IInvoiceService } from '../ports/invoice.port';
import { INVOICE_REPOSITORY } from '../../invoice.di-tokens';
import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { createSessionMapping, invoiceRequestMapping } from '../../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ObjectId } from 'mongodb';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { PAYMENT_SERVICE } from '../../../payment/payment.di-tokens';
import { IPaymentService } from '../../../payment/application/ports/payment.port';
import { KafkaService } from '@common/kafka/kafka.service';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: IInvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService,
    private readonly kafkaMailClient: KafkaService,
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

    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

    // uploading file to Cloudinary
    const fileUrl = await this.uploadFile(
      {
        fileBase64: pdfBase64,
        fileName: `invoice-${invoice._id}.pdf`,
      },
      processId,
    );

    const checkoutSession = await this.paymentService.createCheckoutSession(createSessionMapping(invoice));

    // update invoice status to SENT
    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl,
    });

    this.kafkaMailClient.emit('invoice_sent', {
      invoiceId: invoice._id.toString(),
      userId,
      fileUrl,
      checkoutUrl: checkoutSession.url,
    });

    return checkoutSession.url;
  }

  async generatorInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }

  uploadFile(data: UploadFileTcpReq, processId: string) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpReq>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
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
}
