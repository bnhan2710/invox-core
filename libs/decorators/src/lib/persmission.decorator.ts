import { PERMISSION } from '@common/constants/role.constant';
import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<PERMISSION[]>();
