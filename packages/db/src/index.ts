import { createDB } from "./db";

import * as auth from "./schema/auth";
import * as post from "./schema/post";

export const schema = { ...auth, ...post };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = createDB({ schema, url: process.env.DATABASE_URL!, mode: "planetscale" });
