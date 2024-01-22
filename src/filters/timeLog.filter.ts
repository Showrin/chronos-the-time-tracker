import { Request } from "express";
import { ITimeLogFilter } from "../types/timeLog.type";
import { Between, In } from "typeorm";
import { UserEntity } from "../db/entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export const getTimeLogFilter = async (req: Request) => {
  // @ts-ignore
  const user: UserEntity = req?.user;
  const task = req.query?.task as string;
  const taskType = req.query?.taskType as string;
  const startDate = req.query?.startDate as string;
  const endDate = req.query?.endDate as string;
  const owner = req.query?.owner as string;
  const subordinates: UserEntity[] = await UserRepository.getSubordinates(
    user.id
  );
  const subordinateIds = subordinates.map((subordinate) => subordinate.id);

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
    if (subordinateIds.includes(owner)) {
      timeLogFilter.owner = { id: owner };
    }
  } else {
    timeLogFilter.owner = In(subordinateIds);
  }

  return timeLogFilter;
};
