import { createHandler } from "@niceai/api2";

export const { GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD } = createHandler({
  prefix: "/api/v2",
});

export const runtime = "nodejs"; // 'nodejs' (default) | 'edge'
