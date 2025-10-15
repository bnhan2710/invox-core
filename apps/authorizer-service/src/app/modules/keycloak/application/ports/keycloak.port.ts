import { ExchangeClientTokenResponse, ExchangeUserTokenResponse } from '@common/interfaces/common';
import { CreateKeycloakUserResponse } from '@common/interfaces/common';

export interface IKeycloakPort {
  exchangeClientToken(): Promise<ExchangeClientTokenResponse>;
  exchangeUserToken(credentials: { username: string; password: string }): Promise<ExchangeUserTokenResponse>;
  createUser(data: CreateKeycloakUserResponse): Promise<string>;
}
