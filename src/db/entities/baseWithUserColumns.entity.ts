import { JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";

export abstract class BaseEntityWithUserColumns extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "updatedBy" })
  updatedBy!: UserEntity;
}
