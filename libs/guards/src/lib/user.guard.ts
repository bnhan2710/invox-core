import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constants/common.constant';
import { getAccessToken, setUserData } from '@common/utils/request.utilt';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer/';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { get } from 'mongoose';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(MetadataKeys.SECURED, context.getHandler());

    if (!authOptions?.secured) {
      return true;
    }
    return this.verifyToken(context.switchToHttp().getRequest());
  }

  private async verifyToken(req: any): Promise<boolean> {
    try {
      const token = getAccessToken(req);
      const cacheKey = this.generateTokenCacheKey(token);
      const processId = req[MetadataKeys.PROCESS_ID];

      const cachedData = await this.cacheManager.get<AuthorizeResponse>(cacheKey);

      if (cachedData) {
        setUserData(req, cachedData);
        return true;
      }

      const result = await this.verifyUserToken(token, processId);

      if (!result?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      setUserData(req, result);

      this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Token is invalid');
    }
  }

  verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, {
          data: token,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
