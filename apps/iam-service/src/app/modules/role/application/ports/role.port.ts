export interface IRoleService {
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  getByName(name: string): Promise<any>;
}

export interface IRoleRepository {
  findAll(): Promise<any>;
  findById(id: string): Promise<any>;
  findByName(name: string): Promise<any>;
}
