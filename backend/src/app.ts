import express, { RequestHandler } from "express";
import cors from "cors";
import routes from "./routes";
import hpp from "hpp-clean";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import mongoSanitize from "express-mongo-sanitize";

const sanitizeRequest: RequestHandler = (req, _res, next) => {
  const sanitize = mongoSanitize.sanitize;
  if (req.body && typeof req.body === "object") {
    sanitize(req.body);
  }
  if (req.params && typeof req.params === "object") {
    sanitize(req.params);
  }
  if (req.headers && typeof req.headers === "object") {
    sanitize(req.headers as Record<string, unknown>);
  }
  if (req.query && typeof req.query === "object") {
    sanitize(req.query as Record<string, unknown>);
  }
  next();
};
export const createApp = () => {
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());

  /* The X-Frame-Options header is used to prevent your web pages from being loaded inside a <frame>, <iframe>, <embed>, or <object> of another website. This is particularly useful to prevent clickjacking attacks. */
  app.use(helmet.frameguard({ action: "sameorigin" }));

  //Adding security headers
  app.use((req, res, next) => {
    /*  The Strict-Transport-Security (often referred to as HSTS) header is a security header that instructs browsers to only connect to the server using HTTPS, even if the scheme in the URL is specified as HTTP. This prevents man-in-the-middle attacks that strip SSL/TLS and ensures that the communication remains encrypted. */
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    /* The X-XSS-Protection HTTP header is a security feature that was designed to enable the web browser's built-in reflective cross-site scripting (XSS) protection. It was primarily implemented and used in older versions of Internet Explorer and Chrome.*/
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  /* The X-Powered-By header can reveal information about the technology or framework used by the server, which may provide hints to attackers about potential vulnerabilities. If not required for operational reasons, it's a best practice to remove or modify this header to minimize the information exposure. */
  app.use(helmet.hidePoweredBy());

  /* The X-Content-Type-Options header is used to prevent browsers from MIME-sniffing a response away from the declared content type. When set to nosniff, it blocks a request if the requested type is "style" and the MIME type is not "text/css", or if the requested type is "script" and the MIME type is not a JavaScript MIME type.*/
  app.use(helmet.noSniff());

  app.use(
    express.json({
      limit: "1mb",
    })
  );
  app.use(sanitizeRequest);
  app.use(hpp());
  app.use(cors());
  app.use(requestLogger);
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(apiLimiter);
  app.use("/api", routes);
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
