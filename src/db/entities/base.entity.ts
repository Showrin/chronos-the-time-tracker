import { DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt!: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: false })
  updatedAt!: Date;
}
