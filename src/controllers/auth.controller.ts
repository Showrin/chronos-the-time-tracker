import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import {
  IExistingUserResponse,
  INewUserResponse,
  ISignupRequest,
  IUserWithDeletedAccountResponse,
} from "../interfaces/auth.interface";
import AuthMessage from "../messages/auth.message";

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userInfo: ISignupRequest = req.body;

  try {
    const user = await AuthService.signupUser(userInfo);

    if (!user) {
      const response: IExistingUserResponse = {
        message: AuthMessage.ExistingUser,
        user: null,
      };

      return res.status(400).json(response);
    }

    if (!!user.deletedAt) {
      const response: IUserWithDeletedAccountResponse = {
        message: AuthMessage.UserWithDeletedAccount,
        user: {
          id: user.id,
        },
      };

      return res.status(400).json(response);
    }

    const response: INewUserResponse = {
      message: AuthMessage.NewUser,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        deletedAt: user.deletedAt,
        updatedAt: user.updatedAt,
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
