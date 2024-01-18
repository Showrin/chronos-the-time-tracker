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
