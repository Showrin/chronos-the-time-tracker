import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository";
import { ISignupRequest } from "../interfaces/auth.interface";
import { UserEntity } from "../db/entities/user.entity";

export const signupUser = async (
  user: ISignupRequest
): Promise<UserEntity | null> => {
  const existingUser = await UserRepository.findByEmailWithDeleted(user.email);

  if (existingUser) {
    if (!!existingUser?.deletedAt) {
      return existingUser;
    }

    return null;
  }

  const password = user.password || "";
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserRepository.createUser({
    ...user,
    password: hashPassword,
  });

  return newUser;
};
