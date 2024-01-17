import { Hono } from "hono";

import { db } from "@niceai/db";

const route = new Hono();

route.get("/", async (c) => {
  const posts = await db.query.post.findMany();
  return c.json({
    posts,
  });
});

export default route;
