import { Request, Response, NextFunction } from "express";
import colors from "colors/safe";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;

    const method = colors.cyan(req.method);
    const url = colors.green(req.originalUrl);
    const status =
      res.statusCode >= 500
        ? colors.red(res.statusCode.toString())
        : res.statusCode >= 400
        ? colors.yellow(res.statusCode.toString())
        : colors.green(res.statusCode.toString());

    const time = colors.magenta(`${duration}ms`);
    const timestamp = colors.gray(`[${new Date().toISOString()}]`);
    console.log(`${timestamp} ${method} ${url} -> ${status} (${time})`);
  });
  next();
};
