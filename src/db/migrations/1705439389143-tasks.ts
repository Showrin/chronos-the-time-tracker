import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Tasks1705439389143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "tasks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "project",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "updatedBy",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["project"],
            referencedTableName: "projects",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["updatedBy"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tasks");
  }
}
