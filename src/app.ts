import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import ormConfig from "../ormconfig";

dotenv.config();

const app = express();

app.use(express.json());

const startApp = () => {
  try {
    createConnection(ormConfig)
      .then(() => {
        const PORT = process.env.PORT;

        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      })
      .catch((error) => {
        console.error("Database connection error:", error);
      });
  } catch (error) {
    console.error("Error starting the app:", error);
  }
};

startApp();
