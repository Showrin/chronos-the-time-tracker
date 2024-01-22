import { Request } from "express";
import { ITimeLogFilter } from "../types/timeLog.type";
import { Between } from "typeorm";

export const getTimeLogFilter = (req: Request) => {
  const task = req.query?.task as string;
  const taskType = req.query?.taskType as string;
  const startDate = req.query?.startDate as string;
  const endDate = req.query?.endDate as string;
  const owner = req.query?.owner as string;
  const timeLogFilter: ITimeLogFilter = {};

  if (!!startDate && !!endDate) {
    timeLogFilter.date = Between(new Date(startDate), new Date(endDate));
  }

  if (!!task) {
    timeLogFilter.task = { id: task };
  }

  if (!!taskType) {
    timeLogFilter.taskType = { id: taskType };
  }

  if (!!owner) {
    timeLogFilter.owner = { id: owner };
  }

  return timeLogFilter;
};
