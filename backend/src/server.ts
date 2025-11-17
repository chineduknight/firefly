import { createApp } from "./app";
import { connectMongo } from "./config/mongo";
import { config } from "./config/env";
import "colors";
const start = async () => {
  try {
    await connectMongo();
    console.log("Connected to MongoDB".green);

    const app = createApp();

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}.`.blue.bold);
    });
  } catch (error) {
    console.error("Failed to start server".red.bold, error);
    process.exit(1);
  }
};

start();
