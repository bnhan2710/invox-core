import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from '../application/ports/user.port';
import { User, UserModel, UserModelName } from '@common/schemas/user.schema';

@Injectable()
export class UserMongoRepository implements IUserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: UserModel) {}

  create(data: Partial<User>) {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  getById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  getByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  getByUserId(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).populate('role').exec();
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }
}
