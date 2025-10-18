import { LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { AuthorizeResponse, LoginTcpReq, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';

export interface IAuthorizerService {
  login(credentials: LoginTcpReq);
  verifyUserToken(token: string): Promise<AuthorizeResponse>;
}
