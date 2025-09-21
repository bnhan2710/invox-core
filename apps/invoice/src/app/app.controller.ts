import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { ProcessId } from '@common/decorators/processId.decorator';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(@RequestParams() data: Request<number>, @ProcessId() processId: string): Response<string> {
    return Response.success<string>(`Invoice data for invoice ID: ${data} from process ${processId}`);
  }
}
