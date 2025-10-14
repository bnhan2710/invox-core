import { CreateKeycloakUserResponse, ExchangeClientTokenResponse } from '@common/interfaces/common';
import { IKeycloakPort } from '../application/ports/keycloak.port';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KeycloakHttpAdapter implements IKeycloakPort {
  private readonly logger = new Logger(KeycloakHttpAdapter.name);
  private readonly axiosInstance: AxiosInstance;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('KEYCLOAK_CONFIG.HOST'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.realm = this.configService.get('KEYCLOAK_CONFIG.REALM');
    this.clientId = this.configService.get('KEYCLOAK_CONFIG.CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CONFIG.CLIENT_SECRET');
  }

  async exchangeClientToken(): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('grant_type', 'client_credentials');
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post(`/realms/${this.realm}/protocol/openid-connect/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  }

  async createUser(data: CreateKeycloakUserResponse): Promise<string> {
    const { email, firstName, lastName, password } = data;

    const { access_token } = await this.exchangeClientToken();

    const { headers } = await this.axiosInstance.post(
      `/admin/realms/${this.realm}/users`,
      {
        username: email,
        email: email,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const userId = headers['location']?.split('/')?.pop();

    if (!userId) {
      throw new InternalServerErrorException('Failed to create user in Keycloak');
    }

    this.logger.log(`User created in Keycloak with ID: ${userId}`);

    return userId;
  }
}
