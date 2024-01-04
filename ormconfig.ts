import { ConnectionOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const ormConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.DB_LOGGING === "true" ? true : false,
  entities: ["dist/db/entities/*.js"],
  migrations: ["dist/db/migrations/*.js"],
};

export default ormConfig;
