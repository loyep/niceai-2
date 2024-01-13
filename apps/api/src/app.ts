import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { v4 as uuidv4 } from "uuid";

import posts from "./router/posts";
import users from "./router/users";

export function createApp({ prefix = "/" }: { prefix?: string } = {}): Hono {
  const app = new Hono().basePath(prefix);
  app.use("*", async (c, next) => {
    (c.req as unknown as Record<string, unknown>)["trace-id"] = uuidv4();
    await next();
  });

  app.use("*", cors(), compress(), timing(), logger());

  app.get("/", (c) => {
    const traceId = (c.req as unknown as Record<string, string>)["trace-id"];
    console.log(`traceId: ${traceId}`);
    return c.json({
      message: "hello nice ai.",
    });
  });

  app.route("/users", users);
  app.route("/posts", posts);

  return app;
}
