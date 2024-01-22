import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { createSelectSchema, db, schema } from "@niceai/db";

const router = new OpenAPIHono();

const tags = ["Users"];

const UsersSchema = createSelectSchema(schema.users);
const getAllRoute = createRoute({
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
  tags,
});

router.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Respond a message",
        content: {
          "application/json": {
            schema: z.object({
              users: z.array(
                z.object({
                  id: z.string(),
                  name: z.string().nullable(),
                  email: z.string(),
                  emailVerified: z.string().nullable(),
                  image: z.string().nullable(),
                }),
              ),
            }),
          },
        },
      },
    },
    tags,
  }),
  async (c) => {
    const users = await db.query.users.findMany();
    return c.json({
      users,
    });
  },
);

export default router;
