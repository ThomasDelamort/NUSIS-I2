import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "../db/relations.ts";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

export const pool = new Pool({
  connectionString,
  // Neon requires SSL; localhost doesn't. Enable SSL if the connection
  // string contains "neon.tech" or if PGSSL is explicitly true.
  ssl:
    connectionString.includes("neon.tech") || process.env["PGSSL"] === "true"
      ? { rejectUnauthorized: false }
      : false,
});

// An idle client can drop (e.g. Neon suspending the compute). Without a
// listener, pg emits an unhandled 'error' event and crashes the process.
pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

export const db = drizzle({ client: pool, relations });
