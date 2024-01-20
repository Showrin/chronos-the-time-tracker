import { UserEntity } from "../db/entities/user.entity";

export interface ICreateTaskRequestBody {
  name: string;
  project?: string;
  updatedBy?: string;
}

export interface IUpdateTaskRequestBody {
  name?: string;
  project?: string;
  updatedBy?: string;
}
