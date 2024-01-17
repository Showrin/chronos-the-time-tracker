import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithUserColumns } from "./baseWithUserColumns.entity";

@Entity({ name: "taskTypes" })
export class TaskTypeEntity extends BaseEntityWithUserColumns {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true })
  name!: string;
}
