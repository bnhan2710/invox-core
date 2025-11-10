import { Module } from '@nestjs/common';
import { WebhookController } from './presentation/webhook.controller';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { StripeWebhookService } from './infrastructure/stripe-webhook.service';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)])],
  controllers: [WebhookController],
  providers: [StripeWebhookService],
  exports: [],
})
export class WebhookModule {}
