import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof connect>;

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function connect(url: string) {
  // `prepare: false` keeps queries working behind transaction poolers
  // such as Neon's or Supabase's pooled connection strings.
  const max = positiveInteger(process.env.DB_POOL_MAX, 1);
  return drizzle(
    postgres(url, {
      prepare: false,
      max,
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 300,
    }),
    { schema },
  );
}

// Reuse one pool per server process, including across dev hot reloads.
const cache = globalThis as unknown as { obliqDb?: Database };

// Connect on first use so `next build` works without DATABASE_URL.
export function getDb() {
  if (cache.obliqDb) return cache.obliqDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  cache.obliqDb = connect(url);
  return cache.obliqDb;
}
