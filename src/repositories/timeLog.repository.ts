import { FindManyOptions } from "typeorm";
import {
  ICreateTimeLogRequestBody,
  IUpdateTimeLogRequestBody,
} from "./../types/timeLog.type";
import { JwtPayload } from "jsonwebtoken";
import { AppDataSource } from "../db/conf/appDataSource";
import { TimeLogEntity } from "../db/entities/timeLog.entity";

export const TimeLogRepository = AppDataSource.getRepository(
  TimeLogEntity
).extend({
  relations: ["owner", "updatedBy", "task", "taskType"],

  async getTimeLogs(options: FindManyOptions<TimeLogEntity>) {
    try {
      const timeLogs = await this.findAndCount({
        relations: this.relations,
        ...options,
      });
      return timeLogs;
    } catch (error) {
      throw error;
    }
  },

  async findTimeLogById(id: string) {
    try {
      const timeLog = await this.findOne({
        where: { id },
        relations: this.relations,
      });
      return timeLog;
    } catch (error) {
      throw error;
    }
  },

  async findTimeLogIncludingDeletedByIdAndUser(id: string, userId: string) {
    try {
      const timeLog = await this.createQueryBuilder("timeLog")
        .withDeleted()
        .leftJoinAndSelect("timeLog.owner", "owner")
        .where("timeLog.id = :id AND timeLog.owner = :userId", {
          id,
          userId,
        })
        .getOne();

      return timeLog;
    } catch (error) {
      throw error;
    }
  },

  buildTimeLogOptions(
    timeLog: ICreateTimeLogRequestBody | IUpdateTimeLogRequestBody
  ) {
    return {
      description: timeLog?.description,
      date: timeLog?.date || undefined,
      timeDurationInHours: timeLog?.timeDurationInHours || undefined,
      taskType: timeLog?.taskType
        ? {
            id: timeLog?.taskType,
          }
        : undefined,
      task: timeLog?.task
        ? {
            id: timeLog?.task,
          }
        : undefined,
      owner: timeLog?.owner
        ? {
            id: timeLog?.owner,
          }
        : undefined,
      updatedBy: timeLog?.updatedBy
        ? {
            id: timeLog?.updatedBy,
          }
        : undefined,
    };
  },

  async createTimeLog(timeLog: ICreateTimeLogRequestBody) {
    try {
      const timeLogOptions = this.buildTimeLogOptions(timeLog);
      const newTimeLog = await this.create(timeLogOptions);

      await this.save(newTimeLog);

      const justSavedTimeLog = await this.findTimeLogById(newTimeLog.id);

      return justSavedTimeLog;
    } catch (error) {
      throw error;
    }
  },

  async updateTimeLogById(id: string, timeLog: IUpdateTimeLogRequestBody) {
    try {
      const timeLogOptions = this.buildTimeLogOptions(timeLog);
      const existingTimeLog = await this.findTimeLogById(id);

      if (!existingTimeLog) {
        return null;
      }

      const result = await this.update({ id }, timeLogOptions);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteTimeLogById(id: string, user: JwtPayload) {
    try {
      const timeLog = await this.findTimeLogById(id);

      if (!timeLog) {
        return null;
      }

      const { iat, exp, ...userInfo } = user;

      timeLog.deletedAt = new Date();
      // @ts-ignore
      timeLog.updatedBy = userInfo;

      this.save(timeLog);

      return timeLog;
    } catch (error) {
      throw error;
    }
  },
});
