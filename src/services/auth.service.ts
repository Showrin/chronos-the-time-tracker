import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRepository } from "../repositories/user.repository";
import { ISignupRequest } from "../types/auth.type";
import { UserEntity } from "../db/entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

dotenv.config();

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
    role: RoleEnum.ENGINEER,
    password: hashPassword,
  });

  return newUser;
};

export const generateJwtToken = async (user: UserEntity) => {
  const jwtSecretKey = process.env.JWT_SECRET;

  if (jwtSecretKey) {
    const token = await sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      jwtSecretKey,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }

  return null;
};

export const signinUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  const user = await UserRepository.findByEmail(email, {
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const jwtToken = await generateJwtToken(user);

    return jwtToken;
  } catch (error) {
    console.error(error);
  }

  return null;
};
