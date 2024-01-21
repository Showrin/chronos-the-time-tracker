import { Request } from "express";

export const getPaginationConfig: (req: Request) => {
  skip: number;
  take: number;
} = (req) => {
  const page = parseInt(req?.query?.page as string, 10) || 1;
  const pageSize = parseInt(req?.query?.pageSize as string, 10) || 10;

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};
