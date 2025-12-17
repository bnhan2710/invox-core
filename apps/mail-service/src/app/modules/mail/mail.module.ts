import { Module, Provider } from '@nestjs/common';
import { MailService } from './application/services/mail.service';
import { MAIL_INVOICE_SERVICE, MAIL_SERVICE } from './mail.di-tokens';
import { MailKafkaConsumer } from './presentation/mail.kafka-consumer';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { MailTemplateModule } from '../mail-template/mail-template.module';
import { MailInvoiceService } from './application/services/mail-invoice.service';

const dependencies: Provider[] = [
  {
    provide: MAIL_SERVICE,
    useClass: MailService,
  },
  {
    provide: MAIL_INVOICE_SERVICE,
    useClass: MailInvoiceService,
  },
];

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)]), MailTemplateModule],
  providers: [...dependencies],
  controllers: [MailKafkaConsumer],
})
export class MailModule {}
