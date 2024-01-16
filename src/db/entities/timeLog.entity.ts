import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { TaskEntity } from "./task.entity";
import { TaskTypeEntity } from "./taskType.entity";

@Entity({ name: "timeLogs" })
export class TimeLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => TaskEntity)
  @JoinColumn({ name: "task" })
  task!: TaskEntity;

  @ManyToOne(() => TaskTypeEntity)
  @JoinColumn({ name: "taskType" })
  taskType!: TaskTypeEntity;

  @Column()
  description!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "interval" })
  timeDuration!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "updatedBy" })
  updatedBy!: UserEntity;
}
