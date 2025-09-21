import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { firstValueFrom, map } from 'rxjs';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
@Controller({
  path: 'app',
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({
      message: 'Service is running',
      data: result,
    });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<string, number>('get_invoice', { data: 1, processId })
        .pipe(map((data) => new ResponseDto<string>(data))),
    );
  }
}
