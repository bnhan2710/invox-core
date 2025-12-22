import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from '@common/observability/logger';
import { MetricsModule } from '@common/observability/metrics';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    EventEmitterModule.forRoot(),
    InvoiceModule,
    LoggerModule.forRoot('invoice-service'),
    MetricsModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
