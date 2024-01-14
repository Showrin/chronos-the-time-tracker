import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { RoleEnum } from "../../enums/role.enum";

export class UserRoles1705255974905 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "role",
        type: "enum",
        enum: [
          RoleEnum.SYSTEM_ADMIN,
          RoleEnum.MANAGER,
          RoleEnum.LEAD,
          RoleEnum.ENGINEER,
        ],
        isNullable: true,
      })
    );

    await queryRunner.query(
      `Update "users" SET "role" = '${RoleEnum.ENGINEER}' WHERE "role" is NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "role");
  }
}
