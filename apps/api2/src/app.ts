import { Elysia, t } from 'elysia'
import openai from "./router/openai";
import posts from "./router/posts";
import users from "./router/users";

import { swagger } from '@elysiajs/swagger'

export function createApp({ prefix = "/" }: { prefix?: string } = {}) {
  const app = new Elysia({ 
    prefix,
  })
  app.use(swagger())

  app.use(users({ prefix: "/users" }));
  app.use(posts({ prefix: "/posts" }));
  app.use(openai({ prefix: "/openai" }));

  app.get("/", (c) => {
    return {
      message: "hello nice ai.",
    };
  });

  return app;
}
