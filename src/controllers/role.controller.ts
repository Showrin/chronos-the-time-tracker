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
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getRoles = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roles = await RoleRepository.getRoles();

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

export const getRoleById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roleId = parseInt(req.params?.roleId, 10);
    const role = await RoleRepository.getRoleById(roleId);

    if (!role) {
      return res.status(404).json({ message: errorMessage.NotFound("Role") });
    }

    return res
      .status(200)
      .json({ message: "Role fetched successfully.", role });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
