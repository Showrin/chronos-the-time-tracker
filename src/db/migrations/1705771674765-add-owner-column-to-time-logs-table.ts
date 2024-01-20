import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddOwnerColumnToTimeLogsTable1705771674765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "timeLogs",
      new TableColumn({
        name: "owner",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "timeLogs",
      new TableForeignKey({
        columnNames: ["owner"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("timeLogs", "owner");
  }
}
