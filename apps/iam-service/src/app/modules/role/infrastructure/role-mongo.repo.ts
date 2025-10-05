import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRoleRepository } from '../application/ports/role.port';
import { RoleModel, RoleModelName } from '@common/schemas/role.schema';

@Injectable()
export class RoleMongoRepository implements IRoleRepository {
  constructor(@InjectModel(RoleModelName) private readonly roleModel: RoleModel) {}

  findAll() {
    return this.roleModel.find().exec();
  }

  findById(id: string) {
    return this.roleModel.findById(id).exec();
  }

  findByName(name: string) {
    return this.roleModel.findOne({ name }).exec();
  }
}
