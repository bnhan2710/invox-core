import { Controller, Inject, UseGuards } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { IInvoicePdfService } from '../application/ports/invoice-pdf.port';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Invoice } from '@common/schemas/invoice.schema';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { INVOICE_PDF_SERVICE } from '../invoice-pdf.di-tokens';

@Controller()
@UseGuards(TcpLoggingInterceptor)
export class InvoicePdfTcpController {
  constructor(@Inject(INVOICE_PDF_SERVICE) private readonly invoicePdfService: IInvoicePdfService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF)
  async generateInvoicePdf(@RequestParams() params: Invoice): Promise<Response<string>> {
    const buffer = await this.invoicePdfService.generateInvoicePdf(params);
    return Response.success<string>(Buffer.from(buffer).toString('base64'));
  }
}
