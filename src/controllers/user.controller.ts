import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import {
  IUpdateManagerRequestBody,
  IUpdateRoleRequestBody,
  IUpdateUserRequestBody,
} from "../types/user.type";
import { UserRepository } from "../repositories/user.repository";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await UserRepository.getUsers();

    return res
      .status(200)
      .json({ message: "Users fetched successfully.", users });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const findUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params?.userId;
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    return res
      .status(200)
      .json({ message: "User fetched successfully.", user });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const updateUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params?.userId;
    const userInfo: IUpdateUserRequestBody = req.body;

    if (!!userInfo?.email) {
      const existingUser = await UserRepository.findByEmail(userInfo.email);

      if (!!existingUser) {
        return res.status(400).json({
          message: "A user with the provided email already exists.",
        });
      }
    }

    const result = await UserRepository.updateUserById(userId, {
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    });

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const changeManager = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userInfo: IUpdateManagerRequestBody = req.body;

  if (!userInfo.managedBy) {
    return res.status(400).json({
      message: "Please, provide manager id.",
    });
  }

  try {
    const userId = req.params?.userId;

    const result = await UserRepository.updateUserById(userId, {
      managedBy: userInfo?.managedBy,
    });

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const changeRole = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userInfo: IUpdateRoleRequestBody = req.body;

  if (!userInfo.role) {
    return res.status(400).json({
      message: "Please, provide a valid role.",
    });
  }

  try {
    const userId = req.params?.userId;

    const result = await UserRepository.updateUserById(userId, {
      role: userInfo?.role,
    });

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params?.userId;
    const result = await UserRepository.softDelete(userId);

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const restoreUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params?.userId;
    const result = await UserRepository.restore(userId);

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("User") });
    }

    const user = await UserRepository.findUserById(userId);

    return res
      .status(200)
      .json({ message: "User reactivated successfully.", user });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
