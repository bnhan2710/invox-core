import { Controller, Inject, Logger } from '@nestjs/common';
import { AUTHORIZER_SERVICE } from '../authorizer.di-tokens';
import { IAuthorizerService } from '../application/ports/authorizer.port';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyUserTokenGrpcReq, VerifyUserTokenGrpcRes } from '@common/interfaces/grpc/authorizer';
import { Response } from '@common/interfaces/grpc/common/response.interface';

@Controller()
export class AuthorizeGrpcController {
  constructor(@Inject(AUTHORIZER_SERVICE) private readonly authorizerService: IAuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenGrpcReq): Promise<VerifyUserTokenGrpcRes> {
    const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
    return Response.success(result);
  }
}
