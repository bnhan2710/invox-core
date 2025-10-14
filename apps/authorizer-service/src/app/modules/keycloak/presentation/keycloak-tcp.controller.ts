import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IKeycloakPort } from '../application/ports/keycloak.port';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { KEYCLOAK_HTTP } from '../keycloak.di-tokens';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer/keycloak-request.interface';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class KeycloakTcpController {
  constructor(@Inject(KEYCLOAK_HTTP) private readonly keycloakService: IKeycloakPort) {}
  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(@RequestParams() data: CreateKeycloakUserTcpReq): Promise<Response<string>> {
    const result = await this.keycloakService.createUser(data);
    return Response.success<string>(result);
  }
}
