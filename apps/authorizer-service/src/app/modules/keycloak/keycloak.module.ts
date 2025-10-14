import { Module, Provider } from '@nestjs/common';
import { KEYCLOAK_HTTP } from './keycloak.di-tokens';
import { KeycloakTcpController } from './presentation/keycloak-tcp.controller';
import { KeycloakHttpAdapter } from './insfrastructure/keycloak.http.adapter';

const dependencies: Provider[] = [{ provide: KEYCLOAK_HTTP, useClass: KeycloakHttpAdapter }];

@Module({
  imports: [],
  controllers: [KeycloakTcpController],
  providers: [...dependencies],
  exports: [],
})
export class KeycloakModule {}
