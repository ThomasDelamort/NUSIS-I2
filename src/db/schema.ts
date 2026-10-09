import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Placeholder table so drizzle-kit has something to generate; replace with real tables.
export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
