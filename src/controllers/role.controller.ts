import { Request, Response } from "express";
import { RoleRepository } from "./../repositories/role.repository";
import {
  ICreateRoleRequestBody,
  IUpdateRoleRequestBody,
} from "../types/role.type";
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
    const existingRole = await RoleRepository.findByNameOrAbbr(
      roleInfo.name,
      roleInfo.abbr
    );

    if (!!existingRole) {
      if (!!existingRole.deletedAt) {
        return res.status(400).json({
          message: `A role named "${existingRole.name}" with abbr: "${existingRole.abbr}" was deleted before. Do you want to reactivate it?`,
          existingRole,
        });
      }

      return res.status(400).json({
        message: "A role with the provided name or abbr already exists.",
      });
    }

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

export const updateRoleById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roleId = parseInt(req.params?.roleId, 10);
    const roleInfo: IUpdateRoleRequestBody = req.body;
    const result = await RoleRepository.update(roleId, roleInfo);

    if (result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("Role") });
    }

    return res.status(200).json({ message: "Role updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteRoleById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roleId = parseInt(req.params?.roleId, 10);
    const result = await RoleRepository.deleteRoleById(roleId);

    return res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const reactivateRoleById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const roleId = parseInt(req.params?.roleId, 10);
    const result = await RoleRepository.restore(roleId);

    if (result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("Role") });
    }

    return res.status(200).json({ message: "Role reactivated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
