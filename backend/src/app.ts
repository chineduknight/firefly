import express from "express";
import cors from "cors";
import routes from "./routes";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
