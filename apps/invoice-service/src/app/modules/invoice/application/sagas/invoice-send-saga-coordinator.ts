import { Inject, Injectable } from '@nestjs/common';
import { IInvoiceRepository, IInvoiceEventPublisher, ISagaCoordinator } from '../ports/invoice.port';
import { INVOICE_EVENT_PUBLISHER, INVOICE_REPOSITORY } from '../../invoice.di-tokens';
import { PAYMENT_SERVICE } from '../../../payment/payment.di-tokens';
import { IPaymentService } from '../../../payment/application/ports/payment.port';
import { Invoice } from '@common/schemas/invoice.schema';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { createSessionMapping } from '../mappers';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { firstValueFrom } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { map } from 'rxjs';

@Injectable()
export class SendInvoiceSagaCoordinator implements ISagaCoordinator {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: IInvoiceRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService,
    @Inject(INVOICE_EVENT_PUBLISHER) private readonly invoiceEventPublisher: IInvoiceEventPublisher,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
  ) {}

  //SAGA Pattern Implementation
  //Step1: generate pdf
  private async executePdfGenerationStep(invoice: Invoice, processId: string) {
    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);
    return pdfBase64;
  }
  //Step2: upload file
  private async executeFileUploadStep(pdfBase64: string, invoice: Invoice, processId: string) {
    const fileUrl = await this.uploadFile(
      {
        fileBase64: pdfBase64,
        fileName: `invoice-${invoice._id}.pdf`,
      },
      processId,
    );
    return fileUrl;
  }
  //Step3: create payment link
  private async executeCreatePaymentLinkStep(invoice: Invoice) {
    const checkoutSession = await this.paymentService.createCheckoutSession(createSessionMapping(invoice));
    return checkoutSession.url;
  }

  //complete saga
  private async completeSaga(invoiceId: string, fileUrl: string, checkoutSession: { url: string }) {
    //publish invoice sent event to send mail
    this.invoiceEventPublisher.publishInvoiceSentEvent({
      id: invoiceId,
      paymentLink: checkoutSession.url,
    });

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      fileUrl,
    });
  }

  // Main execution method
  async execute(invoiceId: string, processId: string) {
    try {
      const invoice = await this.invoiceRepository.getById(invoiceId);

      const pdfBase64 = await this.executePdfGenerationStep(invoice, processId);
      const fileUrl = await this.executeFileUploadStep(pdfBase64, invoice, processId);
      const checkoutSession = await this.executeCreatePaymentLinkStep(invoice);

      await this.completeSaga(invoiceId, fileUrl, checkoutSession);
    } catch (error) {
      // Rollback/Compensation logic
      await this.invoiceRepository.updateById(invoiceId, {
        status: INVOICE_STATUS.FAILED,
      });
      // Additional compensation step
      throw error;
    }
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
}
