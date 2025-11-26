import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { MailKafkaConsumer } from './presentation/mail.kafka-consumer';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] })],
  controllers: [MailKafkaConsumer],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
