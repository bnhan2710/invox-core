import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDestination } from '@common/schemas/role.schema';
import { RoleService } from './services/role.service';
import { RoleMongoRepository } from './infras/role-mongo.repo';
import { ROLE_REPOSITORY, ROLE_SERVICE } from './role.di-tokens';
import { MongoProvider } from '@common/configuration/mongo.config';

const dependencies: Provider[] = [
  { provide: ROLE_SERVICE, useClass: RoleService },
  { provide: ROLE_REPOSITORY, useClass: RoleMongoRepository },
];

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([RoleDestination])],
  controllers: [],
  providers: [...dependencies],
})
export class RoleModule {}
