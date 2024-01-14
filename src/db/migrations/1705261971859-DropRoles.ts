import { MigrationInterface, QueryRunner } from "typeorm";
import { Roles1705089631178 } from "./1705089631178-roles";

export class DropRoles1705261971859 implements MigrationInterface {
  revertingMigration = new Roles1705089631178();

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.revertingMigration.down(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.revertingMigration.up(queryRunner);
  }
}
