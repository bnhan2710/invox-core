import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthorizerHttpController } from './presentation/authorizer-http.controller';
@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)])],
  controllers: [AuthorizerHttpController],
  providers: [],
})
export class AuthorizerModule {}
