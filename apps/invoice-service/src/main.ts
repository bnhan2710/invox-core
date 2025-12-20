/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUE_GROUPS } from '@common/constants/enum/queue/queue.enum';
import { Logger as PinoLogger } from '@common/observability/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(PinoLogger));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options.port,
      host: AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options.host,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [AppModule.CONFIGURATION.KAFKA_CONFIG.URL],
      },
      consumer: {
        groupId: QUEUE_GROUPS.INVOICE,
        allowAutoTopicCreation: true,
      },
    },
  });

  const port = process.env.INVOICE_PORT || 3401;

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
