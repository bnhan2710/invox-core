import { LoginTcpReq } from '@common/interfaces/tcp/authorizer';
import { IAuthorizerService } from '../ports/authorizer.port';
import { Inject, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { KEYCLOAK_HTTP } from '../../../keycloak/keycloak.di-tokens';
import { IKeycloakPort } from '../../../keycloak/application/ports/keycloak.port';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Role } from '@common/schemas/role.schema';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IamService } from '@common/interfaces/grpc/user-access';

@Injectable()
export class AuthorizerService implements IAuthorizerService, OnModuleInit {
  private iamService: IamService;
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    @Inject(KEYCLOAK_HTTP) private readonly keycloakHttpService: IKeycloakPort,
    private readonly configService: ConfigService,
    @Inject(GRPC_SERVICES.IAM_SERVICE)
    private readonly grpcIamClient: ClientGrpc,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM');
    this.jwksClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.iamService = this.grpcIamClient.getService<IamService>('IamService');
  }

  async login(credentials: LoginTcpReq) {
    const { username, password } = credentials;
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );
    return { accessToken, refreshToken };
  }

  async verifyUserToken(token: string, processId: string) {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      this.logger.error(`Invalid token structure:`, decoded);
      throw new UnauthorizedException('Token is invalid');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      const user = await this.userValidation(payload.sub, processId);
      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: (user?.roles as unknown as Role[]).flatMap((role) => role.permissions),
          user: user,
          userId: user.id,
        },
      };
    } catch (error) {
      this.logger.error(`Token verification failed:`, error);
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async userValidation(userId: string, processId: string) {
    const user = await firstValueFrom(
      this.iamService.getByUserId({ userId, processId }).pipe(map((data) => data.data)),
    );
    this.logger.debug(`Fetched user data for userId ${userId}: ${JSON.stringify(user)}`);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found.`);
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
