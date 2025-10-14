import { ExchangeClientTokenResponse } from '@common/interfaces/common';
import { CreateKeycloakUserResponse } from '@common/interfaces/common';

export interface IKeycloakPort {
  exchangeClientToken(): Promise<ExchangeClientTokenResponse>;
  createUser(data: CreateKeycloakUserResponse): Promise<string>;
}
