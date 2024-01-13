import { handle } from "hono/vercel";

import { createApp } from "./app";

export const createHandler = ({ prefix }: { prefix: string }) => {
  const app = createApp({ prefix });
  const handler = handle(app);

  return {
    GET: handler,
    POST: handler,
    PUT: handler,
    DELETE: handler,
    PATCH: handler,
    OPTIONS: handler,
    HEAD: handler,
    TRACE: handler,
    CONNECT: handler,
    ALL: handler,
  };
};
