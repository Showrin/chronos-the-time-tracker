import { Request } from "express";
import { ITaskTypeFilter } from "../types/taskType.type";
import { ILike } from "typeorm";

export const getTaskTypeFilter = (req: Request) => {
  const name = req.query?.name as string;
  const taskTypeFilter: ITaskTypeFilter = {};

  if (!!name) {
    taskTypeFilter.name = ILike(`%${name}%`);
  }

  return taskTypeFilter;
};
