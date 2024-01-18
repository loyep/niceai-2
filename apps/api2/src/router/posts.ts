import { Elysia, t } from "elysia";

import { db } from "@niceai/db";

export default function route({ prefix }: { prefix: string }) {
  const app = new Elysia({ prefix });

  app.get("/", async (c) => {
    const posts = await db.query.post.findMany();
    return {
      posts,
    };
  });

  return app;
}
