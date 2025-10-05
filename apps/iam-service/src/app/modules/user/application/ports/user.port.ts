import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { User } from '@common/schemas/user.schema';

export interface IUserService {
  create(params: CreateUserTcpRequest);
}

export interface IUserRepository {
  create(data: Partial<User>);
  getById(id: string): Promise<User | null>;
  getByUserId(userId: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
}
