import { Request, Response, NextFunction } from "express";
import { TimeLogRepository } from "../repositories/timeLog.repository";

export const checkTimeLogAuthority = async (
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
