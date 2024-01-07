#! /usr/bin/env node

const runMigration = () => {
  const shell = require("shelljs");
  const getEnableColorCommand = require("./getEnableColorCommand.ts");

  const MIGRATION_ACTIONS = {
    UP: "up",
    DOWN: "down",
  };
  const datasourceLocation = "./src/db/conf/appDataSource.ts";
  const migrationAction = process.argv.slice(2)[0];
  const enableColorCommand = getEnableColorCommand();
  let command = enableColorCommand;

  switch (migrationAction) {
    case MIGRATION_ACTIONS.UP:
      command += ` && npx typeorm-ts-node-commonjs migration:run -d ${datasourceLocation}`;
      break;

    case MIGRATION_ACTIONS.DOWN:
      command += ` && npx typeorm-ts-node-commonjs migration:revert -d ${datasourceLocation}`;
      break;

    default:
      command += ` && echo Please, define a correct migration action. Expected ["${MIGRATION_ACTIONS.UP}" or "${MIGRATION_ACTIONS.DOWN}"]`;
      break;
  }

  shell.exec(command);
};

runMigration();
