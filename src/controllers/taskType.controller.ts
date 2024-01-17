import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import { ICreateTaskTypeRequestBody } from "../types/taskType.type";
import { TaskTypeRepository } from "../repositories/taskType.repository";

export const createTaskType = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const taskTypeInfo: ICreateTaskTypeRequestBody = req.body;
  // @ts-ignore
  const user: JwtPayload = req?.user;

  if (!taskTypeInfo.name) {
    return res
      .status(400)
      .json({ message: "Please, provide name for the task type." });
  }

  try {
    const existingTaskType = await TaskTypeRepository.findTaskTypeByName(
      taskTypeInfo.name
    );

    if (!!existingTaskType) {
      if (!!existingTaskType.deletedAt) {
        return res.status(400).json({
          message: `A task type named "${existingTaskType.name}" was deleted before. Do you want to reactivate it?`,
          existingTaskType,
        });
      }

      return res.status(400).json({
        message: "A task type with the provided name already exists.",
      });
    }

    const newTaskType = await TaskTypeRepository.createTaskType({
      ...taskTypeInfo,
      updatedBy: { ...user },
    });

    return res.status(201).json({
      message: "Task type created successfully.",
      taskType: newTaskType,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getAllTaskTypes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskTypes = await TaskTypeRepository.getTaskTypes();

    return res
      .status(200)
      .json({ message: "Task types fetched successfully.", taskTypes });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
