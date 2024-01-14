import { Request, Response } from "express";
import { RoleRepository } from "./../repositories/role.repository";
import { ICreateRoleRequestBody } from "../types/role.type";
import errorMessage from "../messages/error.message";
import { JwtPayload } from "jsonwebtoken";

export const createRole = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const roleInfo: ICreateRoleRequestBody = req.body;
  // @ts-ignore
  const user: JwtPayload = req?.user;

  if (!roleInfo.name || !roleInfo.abbr) {
    return res
      .status(400)
      .json({ message: "Please, provide name and abbr for the role." });
  }

  try {
    const newRole = await RoleRepository.createRole({
      ...roleInfo,
      // @ts-ignore
      updatedBy: { ...user },
    });

    return res
      .status(201)
      .json({ message: "Role created successfully.", role: newRole });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError,
    });
  }
};
