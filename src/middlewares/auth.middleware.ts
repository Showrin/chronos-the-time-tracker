import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
