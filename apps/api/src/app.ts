import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";

import openai from "./routes/openai";
import posts from "./routes/posts";
import users from "./routes/users";

export function createApp({
  prefix = "/",
}: { prefix?: string } = {}): OpenAPIHono {
  const app = new OpenAPIHono().basePath(prefix);

  app.get("swagger", swaggerUI({ url: `${prefix}/openapi` }));

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

  app.use("*", cors(), compress(), timing(), logger(), prettyJSON());

  app.openapi(
    createRoute({
      path: "/",
      method: "get",
      responses: {
        200: {
          description: "Respond a message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      tags: ["Default"],
    }),
    (c) => {
      return c.json({
        message: "hello nice ai.",
      });
    },
  );

  app.route("/users", users);
  app.route("/posts", posts);
  app.route("/openai", openai);

  app.doc31("openapi", (c) => {
    const url = new URL(c.req.url);
    url.pathname = prefix;
    return {
      info: {
        title: "Nice AI API",
        version: "v1",
      },
      openapi: "3.1.0",
      servers: [
        {
          url: url.toString(),
          description: "Nice Ai API.",
        },
      ],
      tags: [
        {
          name: "Default",
          description: "Default",
        },
        {
          name: "Users",
          description: "Users",
        },
        {
          name: "Posts",
          description: "Posts",
        },
        {
          name: "Openai",
          description: "OpenAI",
        },
      ],
    };
  });
  return app;
}
