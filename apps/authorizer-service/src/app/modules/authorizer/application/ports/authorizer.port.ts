import { LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { LoginTcpReq, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';

export interface IAuthorizerService {
  login(credentials: LoginTcpReq);
}
