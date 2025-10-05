import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { IUserRepository, IUserService } from '../ports/user.port';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { createUserRequestMapping } from '../../mappers';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async create(params: CreateUserTcpRequest) {
    const isExists = await this.userRepo.exists(params.email);

    if (isExists) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const input = createUserRequestMapping(params);
    return this.userRepo.create(input);
  }
}
