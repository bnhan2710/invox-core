import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { USER_SERVICE } from '../user.di-tokens';
import { IUserService } from '../application/ports/user.port';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserTcpController {
  constructor(@Inject(USER_SERVICE) private readonly userService: IUserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() data: CreateUserTcpRequest) {
    await this.userService.create(data);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }
}
