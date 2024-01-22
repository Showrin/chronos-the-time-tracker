import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import {
  ICreateTimeLogRequestBody,
  IUpdateTimeLogRequestBody,
} from "../types/timeLog.type";
import { TimeLogRepository } from "../repositories/timeLog.repository";
import { JwtPayload } from "jsonwebtoken";
import { UserEntity } from "../db/entities/user.entity";
import { getPaginationConfig } from "../services/paginate.service";
import { getTimeLogFilter } from "../filters/timeLog.filter";
import { FindOptionsWhere } from "typeorm";
import { TimeLogEntity } from "../db/entities/timeLog.entity";

export const createTimeLog = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const timeLogInfo: ICreateTimeLogRequestBody = req.body;
  // @ts-ignore
  const user: UserEntity = req?.user;

  if (
    !timeLogInfo.timeDurationInHours ||
    !timeLogInfo.date ||
    !timeLogInfo.task ||
    !timeLogInfo.taskType ||
    !timeLogInfo.owner
  ) {
    return res.status(400).json({
      message:
        "Please, provide date, timeDurationInHours, task id, owner and task type for the time log.",
    });
  }

  try {
    const newTimeLog = await TimeLogRepository.createTimeLog({
      ...timeLogInfo,
      updatedBy: user.id,
    });

    return res.status(201).json({
      message: "TimeLog created successfully.",
      timeLog: newTimeLog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getTimeLogs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skip, take } = getPaginationConfig(req);
    const [timeLogs, totalCount] = await TimeLogRepository.getTimeLogs({
      skip,
      take,
      where: (await getTimeLogFilter(req)) as FindOptionsWhere<TimeLogEntity>,
    });

    console.log(await getTimeLogFilter(req));

    return res.status(200).json({
      message: "TimeLogs fetched successfully.",
      totalCount,
      timeLogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const findTimeLogById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const timeLogId = req.params?.timeLogId;
    const timeLog = await TimeLogRepository.findTimeLogById(timeLogId);

    if (!timeLog) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("TimeLog") });
    }

    return res
      .status(200)
      .json({ message: "TimeLog fetched successfully.", timeLog });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const updateTimeLogById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const timeLogId = req.params?.timeLogId;
    // @ts-ignore
    const user: UserEntity = req?.user;
    const timeLogInfo: IUpdateTimeLogRequestBody = req.body;

    const result = await TimeLogRepository.updateTimeLogById(timeLogId, {
      ...timeLogInfo,
      updatedBy: user.id,
    });

    if (!result || result.affected === 0) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("TimeLog") });
    }

    return res.status(200).json({ message: "TimeLog updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteTimeLogById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const timeLogId = req.params?.timeLogId;
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const timeLog = await TimeLogRepository.deleteTimeLogById(timeLogId, user);

    if (!timeLog) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("TimeLog") });
    }

    return res.status(200).json({ message: "TimeLog deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
