import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ name: "tasks" })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: "project" })
  project!: ProjectEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "updatedBy" })
  updatedBy!: UserEntity;
}
