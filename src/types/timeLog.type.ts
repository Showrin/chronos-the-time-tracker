export interface ICreateTimeLogRequestBody {
  date: Date;
  description?: string;
  timeDurationInHours: number;
  task: string;
  taskType: number;
  owner: string;
  updatedBy?: string;
}

export interface IUpdateTimeLogRequestBody {
  date?: Date;
  description?: string;
  timeDurationInHours?: number;
  task?: string;
  taskType?: number;
  owner?: string;
  updatedBy?: string;
}