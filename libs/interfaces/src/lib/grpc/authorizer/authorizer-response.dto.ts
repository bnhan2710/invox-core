import { AuthorizeResponse } from '../../tcp/authorizer';

export type VerifyUserTokenGrpcRes = {
  code: string;
  error?: string;
  data?: AuthorizeResponse;
};
