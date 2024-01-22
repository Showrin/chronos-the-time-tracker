import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: async (req: Request, res: Response) => {
    return {
      message: "Too many requests, please try again later.",
    };
  },
});
