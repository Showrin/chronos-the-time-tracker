import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import { RoleEnum } from "../enums/role.enum";

export const getRoles = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roles = Object.values(RoleEnum);

    return res
      .status(200)
      .json({ message: "Roles fetched successfully.", roles });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
