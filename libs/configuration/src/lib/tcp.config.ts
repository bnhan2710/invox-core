import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum TCP_SERVICES {
  INVOICE_SERVICE = 'TCP_INVOICE_SERVICE',
}

export class TcpConfiguration {
  @IsNotEmpty()
  @IsObject()
  TCP_INVOICE_SERVICE: TcpClientOptions;
  constructor() {
    Object.entries(TCP_SERVICES).forEach(([key, service]) => {
      const port = Number(process.env[`${service}_PORT`]);
      const host = process.env[`${key}_HOST`];

      this[service] = TcpConfiguration.setValue(port, host);
    });
  }

  private static setValue(port?: number, host?: string): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: port || 3200,
        host: host || '127.0.0.1',
      },
    };
  }
}

export function TcpProvider(serviceName: keyof TcpConfiguration): ClientsProviderAsyncOptions {
  return {
    imports: [ConfigModule],
    name: serviceName,
    useFactory: async (configService: ConfigService) => {
      return configService.get(`TCP_SERV.${serviceName}`) as TcpClientOptions;
    },
    inject: [ConfigService],
  };
}
