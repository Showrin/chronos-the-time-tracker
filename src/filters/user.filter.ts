import { Request } from "express";
import { IUserFilter } from "../types/user.type";
import { ILike } from "typeorm";

export const getUserFilter = (req: Request) => {
  const name = req.query?.name as string;
  const email = req.query?.email as string;
  const role = req.query?.role as string;
  const managedBy = req.query?.managedBy as string;
  const userFilter: IUserFilter = {};

  if (!!name) {
    userFilter.firstName = ILike(`%${name}%`);
  }

  if (!!email) {
    userFilter.email = ILike(`%${email}%`);
  }

  if (!!role) {
    userFilter.role = role;
  }

  if (!!managedBy) {
    userFilter.managedBy = { id: managedBy };
  }

  return userFilter;
};
