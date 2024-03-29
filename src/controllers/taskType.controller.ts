import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import {
  ICreateTaskTypeRequestBody,
  IUpdateTaskTypeRequestBody,
} from "../types/taskType.type";
import { TaskTypeRepository } from "../repositories/taskType.repository";
import { JwtPayload } from "jsonwebtoken";
import { getPaginationConfig } from "../services/paginate.service";
import { getTaskTypeFilter } from "../filters/taskType.filter";

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
    const existingTaskType =
      await TaskTypeRepository.findTaskTypeByNameWithDeleted(taskTypeInfo.name);

    if (!!existingTaskType) {
      if (!!existingTaskType.deletedAt) {
        return res.status(400).json({
          message: `A task type named "${existingTaskType.name}" was deleted before. Do you want to restore it?`,
          existingTaskType,
        });
      }

      return res.status(400).json({
        message: "A task type with the provided name already exists.",
      });
    }

    const newTaskType = await TaskTypeRepository.createTaskType({
      ...taskTypeInfo,
      // @ts-ignore
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

export const getTaskTypes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skip, take } = getPaginationConfig(req);
    const [taskTypes, totalCount] = await TaskTypeRepository.getTaskTypes({
      skip,
      take,
      where: getTaskTypeFilter(req),
    });

    return res.status(200).json({
      message: "Task types fetched successfully.",
      totalCount,
      taskTypes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getTaskTypeById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskTypeId = parseInt(req.params?.taskTypeId, 10);
    const taskType = await TaskTypeRepository.getTaskTypeById(taskTypeId);

    if (!taskType) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Task type") });
    }

    return res
      .status(200)
      .json({ message: "Task type fetched successfully.", taskType });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const updateTaskTypeById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskTypeId = parseInt(req.params?.taskTypeId, 10);
    // @ts-ignore
    const user = req?.user;
    const taskTypeInfo: IUpdateTaskTypeRequestBody = req.body;

    if (!!taskTypeInfo?.name) {
      const existingTaskType = await TaskTypeRepository.findTaskTypeByName(
        taskTypeInfo.name
      );

      if (!!existingTaskType) {
        return res.status(400).json({
          message: "A task type with the provided name already exists.",
        });
      }
    }

    const result = await TaskTypeRepository.update(taskTypeId, {
      ...taskTypeInfo,
      updatedBy: user,
    });

    if (result.affected === 0) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Task type") });
    }

    return res.status(200).json({ message: "Task type updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteTaskTypeById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskTypeId = parseInt(req.params?.taskTypeId, 10);
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const taskType = await TaskTypeRepository.deleteTaskTypeById(
      taskTypeId,
      user
    );

    if (!taskType) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Task type") });
    }

    return res.status(200).json({ message: "Task type deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const restoreTaskTypeById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskTypeId = parseInt(req.params?.taskTypeId, 10);
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const taskType = await TaskTypeRepository.restoreTaskTypeById(
      taskTypeId,
      user
    );

    if (!taskType) {
      return res
        .status(404)
        .json({ message: errorMessage.NotFound("Task type") });
    }

    return res
      .status(200)
      .json({ message: "Task type reactivated successfully.", taskType });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
