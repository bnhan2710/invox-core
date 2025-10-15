import { LoginTcpReq } from '@common/interfaces/tcp/authorizer';
import { IAuthorizerService } from '../ports/authorizer.port';
import { Inject, Injectable } from '@nestjs/common';
import { KEYCLOAK_HTTP } from '../../../keycloak/keycloak.di-tokens';
import { IKeycloakPort } from '../../../keycloak/application/ports/keycloak.port';

@Injectable()
export class AuthorizerService implements IAuthorizerService {
  constructor(@Inject(KEYCLOAK_HTTP) private readonly keycloakHttpService: IKeycloakPort) {}
  async login(credentials: LoginTcpReq) {
    const { username, password } = credentials;
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );
    return { accessToken, refreshToken };
  }
}
