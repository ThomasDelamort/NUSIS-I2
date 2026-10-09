import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { students } from "./students.schema.ts";

export const dailyLogs = pgTable("daily_logs", {
  logId: integer("log_id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.studentId),
  timeIn: timestamp("time_in", { withTimezone: true }).notNull(),
  timeOut: timestamp("time_out", { withTimezone: true }),
});

export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;
