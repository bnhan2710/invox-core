import { LoginTcpReq } from '@common/interfaces/tcp/authorizer';
import { IAuthorizerService } from '../ports/authorizer.port';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KEYCLOAK_HTTP } from '../../../keycloak/keycloak.di-tokens';
import { IKeycloakPort } from '../../../keycloak/application/ports/keycloak.port';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthorizerService implements IAuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    @Inject(KEYCLOAK_HTTP) private readonly keycloakHttpService: IKeycloakPort,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM');
    this.jwksClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(credentials: LoginTcpReq) {
    const { username, password } = credentials;
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );
    return { accessToken, refreshToken };
  }
  async verifyUserToken(token: string) {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      this.logger.error(`Invalid token structure:`, decoded);
      throw new UnauthorizedException('Token is invalid');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      console.log('Payload:', payload);
      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: [],
          user: null,
          userId: null,
        },
      };
    } catch (error) {
      this.logger.error(`Token verification failed:`, error);
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
