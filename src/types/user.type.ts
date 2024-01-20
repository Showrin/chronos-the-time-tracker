import { RoleEnum } from "../enums/role.enum";

export interface IUpdateUserRequestBody {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: RoleEnum;
  managedBy?: string;
}

export interface IUpdateManagerRequestBody {
  managedBy: string;
}

export interface IUpdateRoleRequestBody {
  role: RoleEnum;
}
