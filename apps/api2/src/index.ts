import { createApp } from "./app";

export const createHandler = ({ prefix }: { prefix: string }) => {
  const app = createApp({ prefix });
  const handler = app.handle;

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
