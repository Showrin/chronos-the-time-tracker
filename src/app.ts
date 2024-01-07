import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import { AppDataSource } from "./db/conf/appDataSource";

dotenv.config();

const app = express();

app.use(express.json());

// routes integration
app.use("/api/auth", authRoutes);

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
