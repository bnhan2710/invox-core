import { Injectable, CanActivate, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@common/decorators/persmission.decorator';
import { PERMISSION } from '@common/constants/role.constant';
import { MetadataKeys } from '@common/constants/common.constant';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: any): boolean {
    const requiredPermissions = this.reflector.get<PERMISSION[]>(Permissions, context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userData = request[MetadataKeys.USER_DATA] as AuthorizeResponse;
    console.log('User Data in Permission Guard:', userData.metadata);
    const userPermissions = userData.metadata.permissions as PERMISSION[];

    Logger.debug(`User permissions: ${userPermissions}`, PermissionGuard.name);
    Logger.debug(`Required permissions: ${requiredPermissions}`, PermissionGuard.name);

    const isValid = requiredPermissions.every((permission) => userPermissions?.includes(permission));

    if (!isValid) {
      throw new ForbiddenException('Permission denied');
    }

    return isValid;
  }
}
