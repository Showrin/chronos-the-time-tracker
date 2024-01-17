import {
  IUpdateTaskTypeRequestBody,
  ICreateTaskTypeRequestBody,
} from "./../types/taskType.type";
import { AppDataSource } from "../db/conf/appDataSource";
import { TaskTypeEntity } from "../db/entities/taskType.entity";

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
      const taskType = await this.findOneBy({ id });
      return taskType;
    } catch (error) {
      throw error;
    }
  },
  async findTaskTypeByName(name: string) {
    try {
      const taskTypes = await this.findOneBy({ name });
      return taskTypes;
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
  async deleteTaskTypeById(id: number) {
    try {
      const result = await this.softDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async reactivateTaskTypeById(id: number) {
    try {
      const result = await this.restore(id);
      return result;
    } catch (error) {
      throw error;
    }
  },
});
