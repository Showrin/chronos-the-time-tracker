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

  async getRoleById(id: number) {
    try {
      const roles = await this.findOneBy({ id });

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

  async updateRoleById(id: number, role: ICreateRoleRequestBody) {
    try {
      const newRole = await this.update({ id }, role);

      return newRole;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoleById(id: number) {
    try {
      const newRole = await this.softDelete(id);

      return newRole;
    } catch (error) {
      throw error;
    }
  },
});
