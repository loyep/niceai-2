import { drizzle as mysql2Drizzle } from "drizzle-orm/mysql2";
import { createPool as createMysql2Poll } from "mysql2/promise";

import { connect as createConnect } from "@planetscale/database";
import { drizzle as planetscaleDrizzle } from "drizzle-orm/planetscale-serverless";

export function createDB<TSchema extends Record<string, unknown> = Record<string, never>>({ url, mode, schema }: { url: string; mode: "planetscale" | "mysql2"; schema: TSchema }) {
  if (mode === "planetscale") {
    const connection = createConnect({
      url,
    });

    return planetscaleDrizzle<TSchema>(connection, { schema });
  }

  const connection = createMysql2Poll(url);

  return mysql2Drizzle<TSchema>(connection, { schema, mode: 'default' });
}