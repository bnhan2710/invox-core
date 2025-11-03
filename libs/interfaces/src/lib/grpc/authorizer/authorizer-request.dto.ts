import { Observable } from 'rxjs';
import { VerifyUserTokenGrpcRes } from './authorizer-response.dto';

export type VerifyUserTokenGrpcReq = {
  token: string;
  processId: string;
};

export interface AuthorizerService {
  verifyUserToken(data: VerifyUserTokenGrpcReq): Observable<VerifyUserTokenGrpcRes>;
}
