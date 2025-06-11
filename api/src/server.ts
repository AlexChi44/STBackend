import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import app from "./app";
import logger from "./config/logger";
// import "dotenv/config";
// require("dotenv").config({ path: "/.env" });

// dotenv.config();

const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
    process.exit(1);
  });
