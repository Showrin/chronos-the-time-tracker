import { Request, Response, NextFunction } from "express";
import { TimeLogRepository } from "../repositories/timeLog.repository";
import { UserEntity } from "../db/entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export const checkTimeLogReadAuthority = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  const user: UserEntity = req?.user;
  const timeLogId = req.params?.timeLogId;
  const owner = req.query?.owner as string;
  const subordinates: UserEntity[] = await UserRepository.getSubordinates(
    user.id
  );
  const subordinateIds = subordinates.map((subordinate) => subordinate.id);

  if (!!owner && owner !== user.id && !subordinateIds.includes(owner)) {
    return res.status(401).json({ message: "Unauthorized Access Denied." });
  }

  if (!!timeLogId) {
    const timeLog = await TimeLogRepository.findTimeLogById(timeLogId);

    if (!!timeLog) {
      if (
        user.id !== timeLog.owner.id &&
        !subordinateIds.includes(timeLog.owner.id)
      ) {
        return res.status(401).json({ message: "Unauthorized Access Denied." });
      }
    }
  }

  next();
  return;
};

export const checkTimeLogModificationAuthority = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timeLogId = req.params?.timeLogId;
  // @ts-ignore
  const user: UserEntity = req?.user;
  const timeLog =
    await TimeLogRepository.findTimeLogIncludingDeletedByIdAndUser(
      timeLogId,
      user.id
    );

  if (!!timeLog) {
    next();
    return;
  }

  return res.status(401).json({ message: "Unauthorized Access Denied." });
};
