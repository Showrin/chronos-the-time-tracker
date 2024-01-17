import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { RoleEnum } from "../../enums/role.enum";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, select: false })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.ENGINEER })
  role!: RoleEnum;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
