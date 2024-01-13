import { createHandler } from "@niceai/api";

export const { GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD } = createHandler({
  prefix: "/api/v1",
});

export const runtime = "nodejs"; // 'nodejs' (default) | 'edge'
