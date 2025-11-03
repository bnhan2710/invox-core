/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: AppModule.CONFIGURATION.TCP_SERV.TCP_IAM_SERVICE.options.port,
      host: AppModule.CONFIGURATION.TCP_SERV.TCP_IAM_SERVICE.options.host,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AppModule.CONFIGURATION.GRPC_SERV.GRPC_IAM_SERVICE.name,
      protoPath: AppModule.CONFIGURATION.GRPC_SERV.GRPC_IAM_SERVICE.options.protoPath,
      url: AppModule.CONFIGURATION.GRPC_SERV.GRPC_IAM_SERVICE.options.url,
    },
  });

  const port = process.env.IAM_PORT || 3403;

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
