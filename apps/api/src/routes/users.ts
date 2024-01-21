import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { db } from "@niceai/db";

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: "get",
    path: "/",
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
    tags: ["users"],
  }),
  async (c) => {
    const users = await db.query.users.findMany();
    return c.json({
      users,
    });
  },
);

export default router;
