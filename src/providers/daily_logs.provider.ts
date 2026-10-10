import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { db } from "../lib/db.ts";
import { startOfCampusDay } from "../lib/campusTime.ts";
import { dailyLogs } from "../schema/daily_logs.schema.ts";
import type { DailyLog } from "../schema/daily_logs.schema.ts";
import { students } from "../schema/students.schema.ts";

export type TapAction = "time-in" | "time-out";

export type TapResult = {
  action: TapAction;
  log: DailyLog;
};

/**
 * Records a card tap: closes the student's open log from today, or opens a new one.
 * Resolves with null when no student is registered to the card.
 */
export const recordTap = async (rfid: string): Promise<TapResult | null> => {
  try {
    return await db.transaction(async (tx) => {
      // Locking the student row serializes taps of the same card, so two quick reads
      // can't both open a log.
      const [student] = await tx
        .select({ studentId: students.studentId })
        .from(students)
        .where(eq(students.rfidUid, rfid))
        .for("update");
      if (!student) return null;

      const now = new Date();
      // Only today's visit can be closed: a log left open yesterday (a forgotten time out)
      // shouldn't turn today's first tap into a time out.
      const [openLog] = await tx
        .select()
        .from(dailyLogs)
        .where(
          and(
            eq(dailyLogs.studentId, student.studentId),
            isNull(dailyLogs.timeOut),
            gte(dailyLogs.timeIn, startOfCampusDay(now)),
          ),
        )
        .orderBy(desc(dailyLogs.timeIn))
        .limit(1);

      if (openLog) {
        const [closed] = await tx
          .update(dailyLogs)
          .set({ timeOut: now })
          .where(eq(dailyLogs.logId, openLog.logId))
          .returning();
        return { action: "time-out", log: closed! };
      }

      const [opened] = await tx
        .insert(dailyLogs)
        .values({ studentId: student.studentId, timeIn: now })
        .returning();
      return { action: "time-in", log: opened! };
    });
  } catch (err: any) {
    console.error("Error recording tap:", err);
    throw err;
  }
};
