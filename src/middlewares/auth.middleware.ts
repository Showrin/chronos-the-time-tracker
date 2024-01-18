import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ICanAccessParams } from "../types/auth.type";
import { RoleEnum } from "../enums/role.enum";
import UserRepository from "../repositories/user.repository";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  if (!!JWT_SECRET) {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({ message: "Forbidden: Invalid Token" });
      }

      // @ts-ignore
      req.user = user;

      next();
    });
  }
};

/**
 *
 * @param params
 * If params = "*", anyone can access
 *
 * System Adming can access all endpoints
 *
 * If params = { engineer: true }, sys admin, manager, lead, engineer can access
 *
 * If params = { lead: true }, sys admin, manager, lead can access
 *
 * If params = { manager: true }, sys admin, manager can access
 *
 * If params = {}, only sys admin can access
 *
 * @returns void
 */
export const canAccess: (
  params: ICanAccessParams
) => (req: Request, res: Response, next: NextFunction) => void = (params) => {
  return async (req, res, next) => {
    if (params === "*") {
      next();
      return;
    } else {
      // @ts-ignore
      const userId = req?.user?.id;
      const user = await UserRepository.findOneBy({ id: userId });
      const userRole = user?.role;

      switch (userRole) {
        case RoleEnum.SYSTEM_ADMIN:
          next();
          return;

        case RoleEnum.MANAGER:
          if (params?.manager || params?.lead || params?.engineer) {
            next();
            return;
          }
          break;

        case RoleEnum.LEAD:
          if (params?.lead || params?.engineer) {
            next();
            return;
          }
          break;

        case RoleEnum.ENGINEER:
          if (params?.engineer) {
            next();
            return;
          }
          break;

        default:
          break;
      }
    }

    return res.status(401).json({ message: "Unauthorized Access Denied." });
  };
};
