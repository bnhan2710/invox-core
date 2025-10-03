import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../role.di-tokens';
import { IRoleRepository, IRoleService } from '../interfaces/role.port';

@Injectable()
export class RoleService implements IRoleService {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository) {}

  getAll() {
    return this.roleRepository.findAll();
  }

  async getById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async getByName(name: string) {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }
}
