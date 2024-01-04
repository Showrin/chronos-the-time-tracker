import express from "express";
import { createConnection } from "typeorm";

const app = express();

app.use(express.json());

createConnection()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
