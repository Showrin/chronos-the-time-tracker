import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddManagedByColumnToUsersTable1705780963817
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "managedBy",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        columnNames: ["managedBy"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "managedBy");
  }
}
