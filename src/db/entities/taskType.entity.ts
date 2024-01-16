import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "taskTypes" })
export class TaskTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "updatedBy" })
  updatedBy!: UserEntity;
}
