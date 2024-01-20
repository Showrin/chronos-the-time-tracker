import { UserEntity } from "../db/entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export interface ISignupRequest {
  email: string;
  firstName: string;
  lastName?: string;
  role: RoleEnum;
  password: string;
}

export interface IExistingUserResponse {
  message: string;
  user: null;
}

export interface IUserWithDeletedAccountResponse {
  message: string;
  user: {
    id: string;
  };
}

export interface INewUserResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleEnum;
    fullName: string;
    managedBy: UserEntity;
    deletedAt: Date | null;
    updatedAt: Date;
  };
}

export interface ISigninRequest {
  email: string;
  password: string;
}

export interface ISigninSuccessResponse {
  message: string;
  token: string;
}

export type ICanAccessParams =
  | {
      manager?: boolean;
      lead?: boolean;
      engineer?: boolean;
    }
  | "*";
