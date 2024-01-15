import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ProjectModeEnum } from "../../enums/projectMode.enum";

export class Projects1705351290566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projects",
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
            name: "startedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "endedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "mode",
            type: "enum",
            enum: [ProjectModeEnum.PROJECT, ProjectModeEnum.FTE],
            isNullable: true,
          },
          {
            name: "devManager",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "projectManager",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "devLead",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "techLead",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "projectLead",
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
            columnNames: ["devManager"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["projectManager"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["devLead"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["techLead"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["projectLead"],
            referencedTableName: "users",
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
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("projects");
  }
}
