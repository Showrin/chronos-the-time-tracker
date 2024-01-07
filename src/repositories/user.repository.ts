import { UserEntity } from "../db/entities/user.entity";
import { AppDataSource } from "../db/conf/appDataSource";
import { ISignupRequest } from "../interfaces/auth.interface";

const UserRepository = AppDataSource.getRepository(UserEntity).extend({
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.findOne({ where: { email } });

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
});

export default UserRepository;
