import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import {
  IExistingUserResponse,
  INewUserResponse,
  ISigninRequest,
  ISignupRequest,
  IUserWithDeletedAccountResponse,
} from "../types/auth.type";
import AuthMessage from "../messages/auth.message";
import errorMessage from "../messages/error.message";

export const TOKEN_BLACKLIST = new Set();

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
        role: user.role,
        managedBy: user.managedBy,
        deletedAt: user.deletedAt,
        updatedAt: user.updatedAt,
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: errorMessage.InternalServerError() });
  }
};

export const signin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userCreds: ISigninRequest = req.body;
  const { email, password } = userCreds;

  if (!email || !password) {
    return res.status(401).send({ message: "Invalid email or password." });
  }

  const jwtToken = await AuthService.signinUser(email, password);

  if (!jwtToken) {
    return res.status(401).send({ message: "Invalid email or password." });
  }

  return res
    .status(200)
    .send({ message: "Login successful.", token: jwtToken });
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const jwtToken = AuthService.extractJwtFromRequest(req);

  TOKEN_BLACKLIST.add(jwtToken);

  return res.status(200).send({ message: "Successfully logged out." });
};
