import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "roles" })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  abbr!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "updatedBy" })
  updatedBy!: UserEntity;
}
