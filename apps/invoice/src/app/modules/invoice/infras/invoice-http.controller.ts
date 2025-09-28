import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { ProcessId } from '@common/decorators/processId.decorator';
import { IInvoiceService } from '../interfaces/invoice.port';
import { INVOICE_SERVICE } from '../invoice.di-tokens';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceHttpController {
  constructor(
    @Inject(INVOICE_SERVICE)
    private readonly invoiceService: IInvoiceService,
  ) {}

  @Get()
  getData() {
    return this.invoiceService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(@RequestParams() data: Request<number>, @ProcessId() processId: string): Response<string> {
    return Response.success<string>(`Invoice data for invoice ID: ${data} from process ${processId}`);
  }
}
