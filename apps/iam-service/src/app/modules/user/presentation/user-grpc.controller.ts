import { Controller, Inject } from '@nestjs/common';
import { USER_SERVICE } from '../user.di-tokens';
import { IUserService } from '../application/ports/user.port';
import { GrpcMethod } from '@nestjs/microservices';
import { UserById } from '@common/interfaces/grpc/user-access';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { User } from '@common/schemas/user.schema';

@Controller()
export class UserGrpcController {
  constructor(@Inject(USER_SERVICE) private readonly userService: IUserService) {}

  @GrpcMethod('IamService', 'getByUserId')
  async getByUserId(payload: UserById): Promise<Response<User>> {
    const result = await this.userService.getByUserId(payload.userId);
    return Response.success<User>(result);
  }
}
