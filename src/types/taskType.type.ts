import { FindOperator } from "typeorm";
import { UserEntity } from "../db/entities/user.entity";

export interface ICreateTaskTypeRequestBody {
  name: string;
  updatedBy?: UserEntity;
}

export interface IUpdateTaskTypeRequestBody {
  name?: string;
  updatedBy?: UserEntity;
}

export interface ITaskTypeFilter {
  name?: FindOperator<string>;
}
