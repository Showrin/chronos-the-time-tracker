import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TimeLogs1705441670152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "timeLogs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "task",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "taskType",
            type: "integer",
            isNullable: true,
          },
          {
            name: "date",
            type: "date",
          },
          {
            name: "timeDuration",
            type: "interval",
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
            columnNames: ["taskType"],
            referencedTableName: "taskTypes",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["task"],
            referencedTableName: "tasks",
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
    await queryRunner.dropTable("timeLogs");
  }
}
