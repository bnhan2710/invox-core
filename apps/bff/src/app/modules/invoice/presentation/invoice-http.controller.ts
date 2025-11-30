import { Body, Controller, Inject, Logger, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreateInvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer';
import { PERMISSION } from '@common/constants/role.constant';
import { Permissions } from '@common/decorators/persmission.decorator';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceHttpController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}
  @Post()
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_GET_BY_ID])
  create(
    @Body() body: CreateInvoiceRequestDto,
    @ProcessId() processId: string,
    @UserData() userData: AuthorizedMetadata,
  ) {
    Logger.debug(`User Data in Invoice Controller: ${JSON.stringify(userData)}`, InvoiceHttpController.name);
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post(':id/send')
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: 'Send invoice to customer' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_SEND])
  send(@Param('id') id: string, @ProcessId() processId: string, @UserData() userData: AuthorizedMetadata) {
    return this.invoiceClient
      .send<string, SendInvoiceTcpReq>(TCP_REQUEST_MESSAGE.INVOICE.SEND, {
        data: { invoiceId: id, userId: userData.userId },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
