import express from "express";
import cors from "cors";
import routes from "./routes";
import hpp from "hpp";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    express.json({
      limit: "1mb",
    })
  );
  app.use(hpp());
  app.use(cors());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api", apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
