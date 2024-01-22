import { Request } from "express";
import { ITaskFilter } from "../types/task.type";
import { ILike } from "typeorm";

export const getTaskFilter = (req: Request) => {
  const name = req.query?.name as string;
  const project = req.query?.project as string;
  const taskFilter: ITaskFilter = {};

  if (!!name) {
    taskFilter.name = ILike(`%${name}%`);
  }

  if (!!project) {
    taskFilter.project = { id: project };
  }

  return taskFilter;
};
