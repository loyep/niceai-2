import type { Elysia } from "elysia";

import { db } from "@niceai/db";

export default function route<T extends string>(app: Elysia<T>) {
  app.get("/", async () => {
    const posts = await db.query.post.findMany();
    return {
      posts,
    };
  });

  return app;
}
