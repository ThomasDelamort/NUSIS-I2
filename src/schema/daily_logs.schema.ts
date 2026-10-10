import { index, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { students } from "./students.schema.ts";

// Columns match the table the original .NET server created, whose column names are PascalCase.
export const dailyLogs = pgTable(
  "daily_logs",
  {
    logId: integer("LogId").primaryKey().generatedByDefaultAsIdentity(),
    studentId: integer("StudentId")
      .notNull()
      .references(() => students.studentId, { onDelete: "cascade" }),
    timeIn: timestamp("TimeIn", { withTimezone: true }).notNull(),
    timeOut: timestamp("TimeOut", { withTimezone: true }),
  },
  (table) => [index("IX_daily_logs_StudentId").on(table.studentId)],
);

export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;
