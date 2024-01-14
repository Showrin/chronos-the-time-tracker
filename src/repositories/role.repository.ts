import { ICreateRoleRequestBody } from "./../types/role.type";
import { AppDataSource } from "../db/conf/appDataSource";
import { RoleEntity } from "../db/entities/role.entity";

export const RoleRepository = AppDataSource.getRepository(RoleEntity).extend({
  async getRoles() {
    try {
      const roles = await this.find();

      return roles;
    } catch (error) {
      throw error;
    }
  },

  async createRole(role: ICreateRoleRequestBody) {
    try {
      const newRole = await this.create(role);

      await this.save(newRole);

      return newRole;
    } catch (error) {
      throw error;
    }
  },
});
