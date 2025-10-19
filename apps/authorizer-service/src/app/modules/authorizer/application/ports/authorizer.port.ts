import { AuthorizeResponse, LoginTcpReq } from '@common/interfaces/tcp/authorizer';

export interface IAuthorizerService {
  login(credentials: LoginTcpReq);
  verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse>;
  getUserById(userId: string, processId: string);
}
