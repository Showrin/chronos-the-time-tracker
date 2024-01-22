import { FindOperator } from "typeorm";
import { ProjectModeEnum } from "../enums/projectMode.enum";

export interface ICreateProjectRequestBody {
  name: string;
  startedAt?: Date;
  endedAt?: Date;
  mode?: ProjectModeEnum;
  devManager?: string;
  projectManager?: string;
  devLead?: string;
  techLead?: string;
  projectLead?: string;
  updatedBy?: string;
}

export interface IUpdateProjectRequestBody {
  name: string;
  startedAt?: Date;
  endedAt?: Date;
  mode?: ProjectModeEnum;
  devManager?: string;
  projectManager?: string;
  devLead?: string;
  techLead?: string;
  projectLead?: string;
  updatedBy?: string;
}

export interface IProjectFilter {
  name?: FindOperator<string>;
  startedAt?: FindOperator<Date>;
  endedAt?: FindOperator<Date>;
  mode?: ProjectModeEnum;
  devManager?: { id: string };
  projectManager?: { id: string };
  devLead?: { id: string };
  techLead?: { id: string };
  projectLead?: { id: string };
}
