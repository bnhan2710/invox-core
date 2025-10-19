import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer/keycloak.request.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { User } from '@common/schemas/user.schema';

export interface IUserService {
  create(params: CreateUserTcpRequest, processId: string);
  createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string): Promise<string>;
  getById(userId: string): Promise<User>;
}

export interface IUserRepository {
  create(data: Partial<User>);
  getById(id: string): Promise<User | null>;
  getByUserId(userId: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
}
