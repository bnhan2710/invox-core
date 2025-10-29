import { Module, Provider } from '@nestjs/common';
import { UserDestination } from '@common/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_SERVICE, USER_REPOSITORY } from './user.di-tokens';
import { UserMongoRepository } from './infrastructure/user-mongo.repo';
import { UserService } from './application/services/user.service';
import { UserTcpController } from './presentation/user-tcp.controller';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserGrpcController } from './presentation/user-grpc.controller';

const dependencies: Provider[] = [
  { provide: USER_SERVICE, useClass: UserService },
  { provide: USER_REPOSITORY, useClass: UserMongoRepository },
];

@Module({
  imports: [
    MongooseModule.forFeature([UserDestination]),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)]),
  ],
  controllers: [UserTcpController, UserGrpcController],
  providers: [...dependencies],
  exports: [MongooseModule],
})
export class UserModule {}
