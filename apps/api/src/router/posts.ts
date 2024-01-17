import { OpenAPIHono, createRoute } from "@hono/zod-openapi";

import { db } from "@niceai/db";

const route = new OpenAPIHono();

route.openapi(createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Respond a message',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },
}), async (c) => {
  const posts = await db.query.post.findMany();
  return c.json({
    posts,
  });
});

export default route;
