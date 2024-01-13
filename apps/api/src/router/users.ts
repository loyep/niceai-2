import { Hono } from "hono";

import { db } from "@niceai/db";

const route = new Hono();

route.get("/", async (c) => {
  const users = await db.query.users.findMany();
  return c.json({
    users,
  });
});

export default route;
