import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProjectEntity } from "./project.entity";
import { BaseEntityWithUserColumns } from "./baseWithUserColumns.entity";

@Entity({ name: "tasks" })
export class TaskEntity extends BaseEntityWithUserColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: "project" })
  project!: ProjectEntity;
}
