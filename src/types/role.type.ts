import { UserEntity } from "../db/entities/user.entity";

export interface ICreateRoleRequestBody {
  name: string;
  abbr: string;
  updatedBy?: UserEntity;
}

export interface IUpdateRoleRequestBody {
  name?: string;
  abbr?: string;
}
