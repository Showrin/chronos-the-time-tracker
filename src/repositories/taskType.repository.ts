import { JwtPayload } from "jsonwebtoken";
import {
  IUpdateTaskTypeRequestBody,
  ICreateTaskTypeRequestBody,
} from "./../types/taskType.type";
import { AppDataSource } from "../db/conf/appDataSource";
import { TaskTypeEntity } from "../db/entities/taskType.entity";
import { IsNull, Not } from "typeorm";

export const TaskTypeRepository = AppDataSource.getRepository(
  TaskTypeEntity
).extend({
  async getTaskTypes() {
    try {
      const taskTypes = await this.find({ relations: ["updatedBy"] });
      return taskTypes;
    } catch (error) {
      throw error;
    }
  },

  async getTaskTypeById(id: number) {
    try {
      const taskType = await this.findOne({
        where: { id },
        relations: ["updatedBy"],
      });
      return taskType;
    } catch (error) {
      throw error;
    }
  },

  async findDeletedTaskTypeById(id: number) {
    try {
      const taskType = await this.findOne({
        withDeleted: true,
        where: {
          id,
          deletedAt: Not(IsNull()),
        },
        relations: ["updatedBy"],
      });

      return taskType;
    } catch (error) {
      throw error;
    }
  },

  async findTaskTypeByName(name: string) {
    try {
      const taskType = await this.findOneBy({ name });
      return taskType;
    } catch (error) {
      throw error;
    }
  },

  async findTaskTypeByNameWithDeleted(name: string) {
    try {
      const taskType = await this.createQueryBuilder("taskType")
        .where("taskType.name = :name", { name })
        .withDeleted()
        .getOne();
      return taskType;
    } catch (error) {
      throw error;
    }
  },

  async createTaskType(taskType: ICreateTaskTypeRequestBody) {
    try {
      const newTaskType = await this.create(taskType);
      await this.save(newTaskType);
      return newTaskType;
    } catch (error) {
      throw error;
    }
  },

  async updateTaskTypeById(id: number, taskType: IUpdateTaskTypeRequestBody) {
    try {
      const result = await this.update({ id }, taskType);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteTaskTypeById(id: number, user: JwtPayload) {
    try {
      const taskType = await this.getTaskTypeById(id);

      if (!taskType) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      taskType.deletedAt = new Date();
      // @ts-ignore
      taskType.updatedBy = userInfo;

      this.save(taskType);

      return taskType;
    } catch (error) {
      throw error;
    }
  },

  async restoreTaskTypeById(id: number, user: JwtPayload) {
    try {
      const taskType = await this.findDeletedTaskTypeById(id);

      if (!taskType) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      taskType.deletedAt = null;
      // @ts-ignore
      taskType.updatedBy = userInfo;

      this.save(taskType);

      return taskType;
    } catch (error) {
      throw error;
    }
  },
});
