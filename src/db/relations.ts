import { defineRelations } from "drizzle-orm";
import * as schema from "../schema/index.ts";

export const relations = defineRelations(schema, (r) => ({
  students: {
    dailyLogs: r.many.dailyLogs(),
  },
  dailyLogs: {
    student: r.one.students({
      from: r.dailyLogs.studentId,
      to: r.students.studentId,
    }),
  },
}));
