import { FindOperator } from "typeorm";
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

export interface ITaskFilter {
  name?: FindOperator<string>;
  project?: { id: string };
}
