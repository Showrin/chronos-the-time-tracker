import { Request, Response, NextFunction } from "express";
import { UserEntity } from "../db/entities/user.entity";

export const checkUserAuthority = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params?.userId;
  // @ts-ignore
  const loggedInUser: UserEntity = req?.user;

  if (loggedInUser?.id === userId) {
    next();
    return;
  }

  return res.status(401).json({ message: "Unauthorized Access Denied." });
};
