import { Request, Response } from "express";
import errorMessage from "../messages/error.message";
import {
  ICreateTaskRequestBody,
  IUpdateTaskRequestBody,
} from "../types/task.type";
import { TaskRepository } from "../repositories/task.repository";
import { JwtPayload } from "jsonwebtoken";
import { UserEntity } from "../db/entities/user.entity";
import { getPaginationConfig } from "../services/paginate.service";

export const createTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const taskInfo: ICreateTaskRequestBody = req.body;
  // @ts-ignore
  const user: UserEntity = req?.user;

  if (!taskInfo.name) {
    return res
      .status(400)
      .json({ message: "Please, provide name for the task." });
  }

  try {
    const existingTask = await TaskRepository.findTaskByNameWithDeleted(
      taskInfo.name
    );

    if (!!existingTask) {
      if (!!existingTask.deletedAt) {
        return res.status(400).json({
          message: `A task named "${existingTask.name}" was deleted before. Do you want to restore it?`,
          existingTask,
        });
      }

      return res.status(400).json({
        message: "A task with the provided name already exists.",
      });
    }

    const newTask = await TaskRepository.createTask({
      ...taskInfo,
      updatedBy: user.id,
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const getTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skip, take } = getPaginationConfig(req);
    const [tasks, totalCount] = await TaskRepository.getTasks({
      skip,
      take,
    });

    return res
      .status(200)
      .json({ message: "Tasks fetched successfully.", totalCount, tasks });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const findTaskById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = req.params?.taskId;
    const task = await TaskRepository.findTaskById(taskId);

    if (!task) {
      return res.status(404).json({ message: errorMessage.NotFound("Task") });
    }

    return res
      .status(200)
      .json({ message: "Task fetched successfully.", task });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const updateTaskById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = req.params?.taskId;
    // @ts-ignore
    const user: UserEntity = req?.user;
    const taskInfo: IUpdateTaskRequestBody = req.body;

    if (!!taskInfo?.name) {
      const existingTask = await TaskRepository.findTaskByName(taskInfo.name);

      if (!!existingTask) {
        return res.status(400).json({
          message: "A task with the provided name already exists.",
        });
      }
    }

    const result = await TaskRepository.updateTaskById(taskId, {
      ...taskInfo,
      updatedBy: user.id,
    });

    if (!result || result.affected === 0) {
      return res.status(404).json({ message: errorMessage.NotFound("Task") });
    }

    return res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const deleteTaskById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = req.params?.taskId;
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const task = await TaskRepository.deleteTaskById(taskId, user);

    if (!task) {
      return res.status(404).json({ message: errorMessage.NotFound("Task") });
    }

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};

export const restoreTaskById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const taskId = req.params?.taskId;
    // @ts-ignore
    const user: JwtPayload = req?.user;

    const task = await TaskRepository.restoreTaskById(taskId, user);

    if (!task) {
      return res.status(404).json({ message: errorMessage.NotFound("Task") });
    }

    return res
      .status(200)
      .json({ message: "Task reactivated successfully.", task });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: errorMessage.InternalServerError(),
    });
  }
};
