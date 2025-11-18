import type { Express } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { Duplex } from "stream";

type QueryValue = string | number;

export interface TestRequestOptions {
  method: "GET" | "POST" | "DELETE";
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface TestResponse<T = any> {
  status: number;
  body: T | undefined;
  headers: Record<string, number | string | string[]>;
}

class MockSocket extends Duplex {
  remoteAddress = "127.0.0.1";

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _read(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _write(
    _chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    callback();
  }

  setTimeout(): this {
    return this;
  }

  setNoDelay(): this {
    return this;
  }

  setKeepAlive(): this {
    return this;
  }
}

const bufferFromChunk = (
  chunk: string | Buffer,
  encoding?: BufferEncoding
): Buffer => {
  if (Buffer.isBuffer(chunk)) {
    return chunk;
  }
  return Buffer.from(chunk, encoding);
};

export const performRequest = <T = any>(
  app: Express,
  options: TestRequestOptions
): Promise<TestResponse<T>> => {
  return new Promise((resolve, reject) => {
    const socket: any = new MockSocket();

    const req = new IncomingMessage(socket);
    const queryEntries = options.query
      ? Object.entries(options.query).map(([key, value]) => [key, String(value)])
      : [];
    const queryString = queryEntries.length
      ? new URLSearchParams(queryEntries).toString()
      : "";

    const url = queryString
      ? `${options.path}?${queryString}`
      : options.path;

    req.url = url;
    req.method = options.method;
    req.headers = {
      host: "localhost",
      ...(options.headers ?? {}),
    };
    (req as any).connection = socket;
    (req as any).socket = socket;
    req.httpVersionMajor = 1;
    req.httpVersionMinor = 1;
    (req as any).originalUrl = url;
    (req as any).app = app;
    (req as any).query = Object.fromEntries(queryEntries);

    const res = new ServerResponse(req);
    (req as any).res = res;
    (res as any).req = req;
    if (typeof (res as any).assignSocket === "function") {
      (res as any).assignSocket(socket);
    }
    const responseChunks: Buffer[] = [];

    const originalWrite = res.write.bind(res);
    res.write = ((chunk: any, encoding?: any, cb?: any) => {
      if (chunk) {
        responseChunks.push(bufferFromChunk(chunk, encoding));
      }
      return originalWrite(chunk, encoding, cb);
    }) as typeof res.write;

    const originalEnd = res.end.bind(res);
    res.end = ((chunk?: any, encoding?: any, cb?: any) => {
      if (chunk) {
        responseChunks.push(bufferFromChunk(chunk, encoding));
      }
      return originalEnd(chunk, encoding, cb);
    }) as typeof res.end;

    res.on("finish", () => {
      const rawBody = Buffer.concat(responseChunks);
      const headers = res.getHeaders();
      const contentType = headers["content-type"];
      let parsedBody: any = undefined;

      if (rawBody.length > 0) {
        const text = rawBody.toString("utf8");
        if (
          typeof contentType === "string" &&
          contentType.includes("application/json")
        ) {
          try {
            parsedBody = JSON.parse(text);
          } catch {
            parsedBody = text;
          }
        } else {
          parsedBody = text;
        }
      }

      resolve({
        status: res.statusCode,
        body: parsedBody,
        headers: headers as Record<string, number | string | string[]>,
      });
    });

    res.on("error", (err) => reject(err));
    req.on("error", (err) => reject(err));

    const payload =
      options.body === undefined ? null : JSON.stringify(options.body);

    if (payload) {
      req.headers["content-type"] =
        req.headers["content-type"] ?? "application/json";
      req.headers["content-length"] = Buffer.byteLength(payload).toString();
    }

    (app as any)(req, res);

    process.nextTick(() => {
      if (payload) {
        req.emit("data", Buffer.from(payload));
      }
      req.emit("end");
    });
  });
};
