import { Module } from '@nestjs/common';
import { UserHttpController } from './presentation/user-http.controller';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ClientsModule } from '@nestjs/microservices';
@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.IAM_SERVICE)])],
  controllers: [UserHttpController],
  providers: [],
  exports: [],
})
export class UserModule {}
