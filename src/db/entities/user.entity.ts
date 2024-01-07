import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { BaseEntity } from "./base.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ select: false })
  password!: string;

  @BeforeInsert()
  private generateUUID() {
    this.id = uuidv4();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
