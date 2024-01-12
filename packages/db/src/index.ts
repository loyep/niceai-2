// import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

import * as auth from "./schema/auth";
import * as post from "./schema/post";

export const schema = { ...auth, ...post };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

// const connection = connect({
//   // host: process.env.DB_HOST!,
//   // username: process.env.DB_USERNAME!,
//   // password: process.env.DB_PASSWORD!,
//   url: process.env.DATABASE_URL!,
// });
const poolConnection = createPool({
  uri: process.env.DATABASE_URL!,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
