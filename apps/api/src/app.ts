import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import { v4 as uuidv4 } from "uuid";

import openai from "./router/openai";
import posts from "./router/posts";
import users from "./router/users";

export function createApp({
  prefix = "/",
}: { prefix?: string } = {}): OpenAPIHono {
  const app = new OpenAPIHono().basePath(prefix);
  app.use("*", async (c, next) => {
    (c.req as unknown as Record<string, unknown>)["trace-id"] = uuidv4();
    await next();
  });

  app.get("/swagger", swaggerUI({ url: "/api/v1/swagger.json" }));

  /**
   * Default route when no other route matches.
   * Returns a JSON response with a message and status code 404.
   */
  app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

  /**
   * Global error handler.
   * If error is instance of HTTPException, returns the custom response.
   * Otherwise, logs the error and returns a JSON response with status code 500.
   */
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    c.status(500);
    return c.json({ status: "failure", message: err.message });
  });

  app.use("*", cors(), compress(), timing(), logger());
  // Use prettyJSON middleware for all routes
  app.use("*", prettyJSON());

  app.get("/", (c) => {
    const traceId = (c.req as unknown as Record<string, string>)["trace-id"];
    console.log(`traceId: ${traceId}`);
    return c.json({
      message: "hello nice ai.",
    });
  });

  app.route("/users", users);
  app.route("/posts", posts);
  app.route("/openai", openai);

  app.doc("/swagger.json", {
    info: {
      title: "An API",
      version: "v1",
    },
    openapi: "3.1.0",
  });
  return app;
}
