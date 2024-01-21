import {
  ICreateTaskRequestBody,
  IUpdateTaskRequestBody,
} from "./../types/task.type";
import { JwtPayload } from "jsonwebtoken";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../db/conf/appDataSource";
import { IsNull, Not } from "typeorm";
import { TaskEntity } from "../db/entities/task.entity";

export const TaskRepository = AppDataSource.getRepository(TaskEntity).extend({
  relations: ["project", "updatedBy"],

  async getTasks(options: FindManyOptions<TaskEntity>) {
    try {
      const tasks = await this.findAndCount({
        relations: this.relations,
        ...options,
      });
      return tasks;
    } catch (error) {
      throw error;
    }
  },

  async findTaskById(id: string) {
    try {
      const task = await this.findOne({
        where: { id },
        relations: this.relations,
      });
      return task;
    } catch (error) {
      throw error;
    }
  },

  async findDeletedTaskById(id: string) {
    try {
      const task = await this.findOne({
        withDeleted: true,
        where: {
          id,
          deletedAt: Not(IsNull()),
        },
        relations: this.relations,
      });

      return task;
    } catch (error) {
      throw error;
    }
  },

  async findTaskByName(name: string) {
    try {
      const task = await this.findOneBy({ name });
      return task;
    } catch (error) {
      throw error;
    }
  },

  async findTaskByNameWithDeleted(name: string) {
    try {
      const task = await this.createQueryBuilder("task")
        .where("task.name = :name", { name })
        .withDeleted()
        .getOne();
      return task;
    } catch (error) {
      throw error;
    }
  },

  buildTaskOptions(task: ICreateTaskRequestBody | IUpdateTaskRequestBody) {
    return {
      name: task?.name,
      project: task?.project
        ? {
            id: task?.project,
          }
        : undefined,
      updatedBy: task?.updatedBy
        ? {
            id: task?.updatedBy,
          }
        : undefined,
    };
  },

  async createTask(task: ICreateTaskRequestBody) {
    try {
      const taskOptions = this.buildTaskOptions(task);
      const newTask = await this.create(taskOptions);

      await this.save(newTask);

      const justSavedTask = await this.findTaskById(newTask.id);

      return justSavedTask;
    } catch (error) {
      throw error;
    }
  },

  async updateTaskById(id: string, task: IUpdateTaskRequestBody) {
    try {
      const taskOptions = this.buildTaskOptions(task);
      const existingTask = await this.findTaskById(id);

      if (!existingTask) {
        return null;
      }

      const result = await this.update({ id }, taskOptions);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteTaskById(id: string, user: JwtPayload) {
    try {
      const task = await this.findTaskById(id);

      if (!task) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      task.deletedAt = new Date();
      // @ts-ignore
      task.updatedBy = userInfo;

      this.save(task);

      return task;
    } catch (error) {
      throw error;
    }
  },

  async restoreTaskById(id: string, user: JwtPayload) {
    try {
      const task = await this.findDeletedTaskById(id);

      console.log(task);

      if (!task) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      task.deletedAt = null;
      // @ts-ignore
      task.updatedBy = userInfo;

      this.save(task);

      return task;
    } catch (error) {
      throw error;
    }
  },
});
