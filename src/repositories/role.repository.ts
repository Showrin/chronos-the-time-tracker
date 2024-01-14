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

  async findByNameOrAbbr(name?: string, abbr?: string) {
    try {
      const role = await this.createQueryBuilder("role")
        .where("role.name = :name OR role.abbr = :abbr", { name, abbr })
        .withDeleted()
        .getOne();

      return role;
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
      const result = await this.update({ id }, role);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoleById(id: number) {
    try {
      const result = await this.softDelete(id);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async reactivateRoleById(id: number) {
    try {
      const result = await this.restore(id);

      return result;
    } catch (error) {
      throw error;
    }
  },
});
