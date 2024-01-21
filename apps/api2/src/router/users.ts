import type { Elysia } from "elysia";

import { db } from "@niceai/db";

export default function route<T extends string>(app: Elysia<T>) {
  app.get("/", async () => {
    const users = await db.query.users.findMany();
    return {
      users,
    };
  });

  return app;
}
