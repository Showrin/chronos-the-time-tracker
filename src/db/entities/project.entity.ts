import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ProjectModeEnum } from "../../enums/projectMode.enum";
import { BaseEntityWithUserColumns } from "./baseWithUserColumns.entity";

@Entity({ name: "projects" })
export class ProjectEntity extends BaseEntityWithUserColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "timestamp", nullable: true })
  startedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  endedAt!: Date;

  @Column({ type: "enum", enum: ProjectModeEnum, nullable: true })
  mode!: ProjectModeEnum;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "devManager" })
  devManager!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "projectManager" })
  projectManager!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "devLead" })
  devLead!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "techLead" })
  techLead!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "projectLead" })
  projectLead!: UserEntity;
}
