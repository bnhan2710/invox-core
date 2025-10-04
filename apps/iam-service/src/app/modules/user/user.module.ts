import { Module } from '@nestjs/common';
import { UserDestination } from '@common/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([UserDestination])],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class UserModule {}
