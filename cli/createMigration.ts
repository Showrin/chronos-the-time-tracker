#! /usr/bin/env node

const createMigration = () => {
  const shell = require("shelljs");
  const getEnableColorCommand = require("./getEnableColorCommand.ts");

  const params = process.argv.slice(2);
  const migrationDirectory = "./src/db/migrations/";
  const migrationEntityName = params[0];
  const enableColorCommand = getEnableColorCommand();
  let command = enableColorCommand;

  if (!migrationEntityName) {
    command += " && echo Entity name is missing. Please, provide one.";
  } else {
    command += ` && typeorm migration:create ${migrationDirectory}${migrationEntityName}`;

    shell.exec(`echo Running "${command}"`);
    shell.exec(`echo ----------------------`);
  }

  shell.exec(command);
};

createMigration();
