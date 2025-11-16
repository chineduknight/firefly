import { createApp } from "./app";
import { connectMongo } from "./config/mongo";
import { config } from "./config/env";

const start = async () => {
  try {
    await connectMongo();
    console.log("Connected to MongoDB");

    const app = createApp();

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
