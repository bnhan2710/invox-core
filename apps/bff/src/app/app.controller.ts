import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'app',
})
export class AppController {
  constructor(private readonly appService: AppService, @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({
      message: 'Service is running',
      data: result,
    });
  }

  @Get('invoice')
  async getInvoice() {
    const invoices = await firstValueFrom(this.invoiceClient.send('get_invoice', 1));
    return new ResponseDto({
      message: 'Invoices fetched successfully',
      data: invoices,
    });
  }
}
