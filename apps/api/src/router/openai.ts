import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validator } from 'hono/validator'
import { z } from 'zod'

import { db } from "@niceai/db";

const route = new OpenAPIHono();

route.get('/', async (c) => {
  const posts = await db.query.post.findMany();
  return c.json({
    posts,
  });
});

export default route;
