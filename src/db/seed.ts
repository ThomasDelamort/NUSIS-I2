import { sql } from "drizzle-orm";
import { db, pool } from "../lib/db.ts";
import { students } from "../schema/students.schema.ts";

// Rows exported from the previous database (pgAdmin CSV).
const rows: (typeof students.$inferInsert)[] = [
  { studentId: 1, rfidUid: "3906701135", firstName: "Christian Neal", lastName: "Paredes", universityId: "2025-1139051", universityEmail: "paredescf@students.nu-cebu.edu.ph", contactNumber: "09543481526", createdAt: new Date("2026-09-28T17:35:00.793608+08:00") },
  { studentId: 2, rfidUid: "3906277695", firstName: "Devann Dereck", lastName: "Villarin", universityId: "2025-1131863", universityEmail: "villarinde@students.nu-cebu.edu.ph", contactNumber: "09159676494", createdAt: new Date("2026-09-28T17:37:42.692114+08:00") },
  { studentId: 3, rfidUid: "1145533655", firstName: "Abner", lastName: "Penig", universityId: "2025-1133178", universityEmail: "penigaa@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:44:02.973299+08:00") },
  { studentId: 4, rfidUid: "0993858663", firstName: "Lance", lastName: "Gam", universityId: "2025-1131510", universityEmail: "gamlm@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:45:00.367114+08:00") },
  { studentId: 5, rfidUid: "0992384807", firstName: "Seff", lastName: "Macua", universityId: "2025-1131074", universityEmail: "macuasb@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:50:58.084665+08:00") },
  { studentId: 6, rfidUid: "3907648047", firstName: "Jon Vincent", lastName: "Nacua", universityId: "2025-1138377", universityEmail: "nacuajf@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:52:48.877814+08:00") },
  { studentId: 7, rfidUid: "3906763759", firstName: "Aeirol John", lastName: "Gilo", universityId: "2025-1134744", universityEmail: "giloaa@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:57:47.194581+08:00") },
  { studentId: 8, rfidUid: "3907559215", firstName: "Just", lastName: "Tacang", universityId: "2025-1132900", universityEmail: "tacangjr@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T07:59:07.948173+08:00") },
  { studentId: 9, rfidUid: "1145041223", firstName: "Brendon", lastName: "Balbuena", universityId: "2025-1133951", universityEmail: "balbuenabh@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T08:00:56.82059+08:00") },
  { studentId: 10, rfidUid: "3280143074", firstName: "Ronie Bert", lastName: "Lauron", universityId: "2025-1137066", universityEmail: "lauronrs@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T08:02:01.33903+08:00") },
  { studentId: 11, rfidUid: "3907177103", firstName: "Audrey", lastName: "Cagado", universityId: "2025-1135243", universityEmail: "cagadoa@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T08:06:39.095366+08:00") },
  { studentId: 12, rfidUid: "3907861071", firstName: "Hiro", lastName: "Paquibot", universityId: "2025-1137301", universityEmail: "paquibotht@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T08:09:15.110155+08:00") },
  { studentId: 13, rfidUid: "1145133079", firstName: "Judd Rylee", lastName: "Bahian", universityId: "2025-1134790", universityEmail: "bahianjc@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-29T08:15:47.99589+08:00") },
  { studentId: 14, rfidUid: "1058676503", firstName: "Chad Andrey", lastName: "Irig", universityId: "2025-1137883", universityEmail: "irigcn@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-30T11:51:59.92674+08:00") },
  { studentId: 15, rfidUid: "1144749783", firstName: "Norman Paule", lastName: "Acuin", universityId: "2025-1136159", universityEmail: "acuinns@students.nu-cebu.edu.ph", createdAt: new Date("2026-09-30T12:01:19.120851+08:00") },
];

// Skips rows that already exist, so the seed is safe to re-run.
const inserted = await db.insert(students).values(rows).onConflictDoNothing().returning();

// The rows carry explicit IDs, so move the identity sequence past them.
await db.execute(
  sql`SELECT setval(pg_get_serial_sequence('students', 'StudentId'), (SELECT max("StudentId") FROM "students"))`,
);

console.log(`Seeded ${inserted.length} of ${rows.length} students.`);
await pool.end();
