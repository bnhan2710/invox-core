import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDestination } from '@common/schemas/role.schema';
import { RoleService } from './application/services/role.service';
import { RoleMongoRepository } from './infrastructure/role-mongo.repo';
import { ROLE_REPOSITORY, ROLE_SERVICE } from './role.di-tokens';

const dependencies: Provider[] = [
  { provide: ROLE_SERVICE, useClass: RoleService },
  { provide: ROLE_REPOSITORY, useClass: RoleMongoRepository },
];

@Module({
  imports: [MongooseModule.forFeature([RoleDestination])],
  controllers: [],
  providers: [...dependencies],
})
export class RoleModule {}
