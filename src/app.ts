import morgan from "morgan";
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./db/conf/appDataSource";
import { baseRouter } from "./routes/base.route";
import { rateLimiter } from "./services/rateLimit.service";

dotenv.config();

const app = express();

app.use(rateLimiter);
app.use(express.json());
app.use(morgan("tiny"));

// routes integration
app.use("/api", baseRouter);

AppDataSource.initialize()
  .then(async () => {
    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("Data Source has been initialized!");
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
