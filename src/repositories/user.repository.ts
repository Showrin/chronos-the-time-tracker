import { IUpdateUserRequestBody } from "./../types/user.type";
import { UserEntity } from "../db/entities/user.entity";
import { AppDataSource } from "../db/conf/appDataSource";
import { ISignupRequest } from "../types/auth.type";

export const UserRepository = AppDataSource.getRepository(UserEntity).extend({
  relations: ["managedBy"],

  async findByEmail(
    email: string,
    options: any = {}
  ): Promise<UserEntity | null> {
    const user = await this.findOne({ where: { email }, ...options });

    return user || null;
  },

  async findByEmailWithDeleted(email: string): Promise<UserEntity | null> {
    const user = await this.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .withDeleted()
      .getOne();

    return user || null;
  },

  async createUser(user: ISignupRequest): Promise<UserEntity> {
    const newUser = this.create(user);

    await this.save(newUser);

    return newUser;
  },

  async getUsers() {
    try {
      const users = await this.find({
        relations: this.relations,
      });
      return users;
    } catch (error) {
      throw error;
    }
  },

  async findUserById(id: string) {
    try {
      const user = await this.findOne({
        where: { id },
        relations: this.relations,
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  buildUserOptions(user: IUpdateUserRequestBody) {
    return {
      email: user?.email || undefined,
      firstName: user?.firstName || undefined,
      lastName: user?.lastName || undefined,
      role: user?.role || undefined,
      managedBy: user?.managedBy
        ? {
            id: user?.managedBy,
          }
        : undefined,
    };
  },

  async updateUserById(id: string, user: IUpdateUserRequestBody) {
    try {
      const userOptions = this.buildUserOptions(user);
      const existingUser = await this.findUserById(id);

      if (!existingUser) {
        return null;
      }

      const result = await this.update({ id }, userOptions);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async getSubordinates(userId: string) {
    const query = `
    WITH RECURSIVE user_hierarchy AS (
      SELECT *, 1 as "hirerchyLevel" FROM users WHERE "managedBy" = $1
      UNION
      SELECT u.*, h."hirerchyLevel" + 1 as "hirerchyLevel" FROM users u
      JOIN user_hierarchy h ON u."managedBy" = h.id
    )
    SELECT * FROM user_hierarchy;
  `;

    const hierarchy = await this.query(query, [userId]);
    return hierarchy;
  },
});
