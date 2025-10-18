import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { AUTHORIZER_SERVICE } from '../authorizer.di-tokens';
import { IAuthorizerService } from '../application/ports/authorizer.port';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse, LoginTcpReq, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerTcpController {
  constructor(@Inject(AUTHORIZER_SERVICE) private readonly authorizerService: IAuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() credentials: LoginTcpReq) {
    const result = await this.authorizerService.login(credentials);
    return Response.success<LoginTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN)
  async verifyUserToken(@RequestParams() params: string) {
    const result = await this.authorizerService.verifyUserToken(params);
    return Response.success<AuthorizeResponse>(result);
  }
}
