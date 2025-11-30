import { Inject, Injectable } from '@nestjs/common';
import { IMailInvoiceService, IMailService } from '../ports/mail.port';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';
import { MAIL_SERVICE } from '../../mail.di-tokens';
import { MailTemplateService } from '../../../mail-template/services/mail-template.service';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';

@Injectable()
export class MailInvoiceService implements IMailInvoiceService {
  constructor(
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    private readonly mailTemplateService: MailTemplateService,
  ) {}

  async sendInvoice(payload: InvoiceSentPayload) {
    const invoice = await this.getInvoiceById(payload.id);
    const html = await this.mailTemplateService.render('invoice', {
      clientName: invoice.client.name,
      senderName: 'Bao Nhan',
      invoiceCode: `#${invoice.id}`,
      paymentLink: payload.paymentLink,
    });

    this.mailService.sendMail({
      html,
      subject: 'Send Invoice',
      to: invoice.client.email,
      attachments: [{ filename: `invoice-${invoice.id}.pdf`, path: invoice.fileUrl }],
    });
  }

  getInvoiceById(id: string) {
    return firstValueFrom(
      this.invoiceClient
        .send<InvoiceTcpResponse, string>(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID, {
          data: id,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
