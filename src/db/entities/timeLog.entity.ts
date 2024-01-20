import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TaskEntity } from "./task.entity";
import { TaskTypeEntity } from "./taskType.entity";
import { BaseEntityWithUserColumns } from "./baseWithUserColumns.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "timeLogs" })
export class TimeLogEntity extends BaseEntityWithUserColumns {
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
  timeDurationInHours!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "owner" })
  owner!: UserEntity;
}
