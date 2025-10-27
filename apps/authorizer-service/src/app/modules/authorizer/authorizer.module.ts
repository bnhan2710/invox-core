import { Module, Provider } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { AuthorizerTcpController } from './presentation/authorizer-tcp.controller';
import { AUTHORIZER_SERVICE } from './authorizer.di-tokens';
import { AuthorizerService } from './application/services/authorizer.service';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ClientsModule } from '@nestjs/microservices';
import { AuthorizeGrpcController } from './presentation/authorizer-grpc.controller';

const dependencies: Provider[] = [
  {
    provide: AUTHORIZER_SERVICE,
    useClass: AuthorizerService,
  },
];

@Module({
  imports: [KeycloakModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.IAM_SERVICE)])],
  controllers: [AuthorizerTcpController, AuthorizeGrpcController],
  providers: [...dependencies],
  exports: [],
})
export class AuthorizerModule {}
