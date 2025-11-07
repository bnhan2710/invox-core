import { Controller, Get, Inject, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { ProcessId } from '@common/decorators/processId.decorator';
import { IInvoiceService } from '../application/ports/invoice.port';
import { INVOICE_SERVICE } from '../invoice.di-tokens';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateInvoiceTcpRequest, InvoiceTcpResonse, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceTcpController {
  constructor(
    @Inject(INVOICE_SERVICE)
    private readonly invoiceService: IInvoiceService,
  ) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResonse>> {
    const result = await this.invoiceService.create(params);
    return Response.success<InvoiceTcpResonse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async send(@RequestParams() params: SendInvoiceTcpReq, @ProcessId() processId: string): Promise<Response<string>> {
    const result = await this.invoiceService.sendById(params, processId);
    return Response.success<string>(result);
  }
}
