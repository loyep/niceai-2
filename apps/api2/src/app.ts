import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

import openai from "./router/openai";
import posts from "./router/posts";
import users from "./router/users";

export function createApp({ prefix = "/" }: { prefix?: string } = {}) {
  const app = new Elysia({
    prefix,
  });
  app.use(
    swagger({
      provider: "swagger-ui",
      autoDarkMode: false,
    }),
  );

  console.log("prefix", prefix);

  app.group("/users", users);
  app.group("/posts", posts);
  app.group("/openai", openai);

  app.get(
    "/",
    ({ query }: { query: { k?: string } }) => {
      console.log("params", query);
      return {
        key: query.k,
        message: "hello nice ai.",
      };
    },
    {
      params: t.Partial(
        t.Object({
          k: t.String(),
        }),
      ),
    },
  );

  return app;
}
