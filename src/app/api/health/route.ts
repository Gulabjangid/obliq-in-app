import { sql } from "drizzle-orm";
import { getDb } from "@/server/db/client";

export const dynamic = "force-dynamic";

const HEALTH_TIMEOUT_MS = 2_000;

export async function GET() {
  const healthCheck = getDb().execute(sql`select 1`);

  try {
    await Promise.race([
      healthCheck,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Database health check timed out")),
          HEALTH_TIMEOUT_MS,
        ),
      ),
    ]);

    return Response.json(
      {
        status: "ok",
        database: "up",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return Response.json(
      {
        status: "error",
        database: "unavailable",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
