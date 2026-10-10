import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// Columns mirror the students CSV export, whose column names are PascalCase.
export const students = pgTable("students", {
  studentId: integer("StudentId").primaryKey().generatedByDefaultAsIdentity(),
  rfidUid: varchar("RfidUid", { length: 15 }).notNull().unique(),
  firstName: varchar("FirstName", { length: 50 }).notNull(),
  lastName: varchar("LastName", { length: 50 }).notNull(),
  universityId: varchar("UniversityId", { length: 20 }).notNull().unique(),
  universityEmail: varchar("UniversityEmail", { length: 255 }).notNull().unique(),
  contactNumber: varchar("ContactNumber", { length: 20 }),
  profilePicture: varchar("ProfilePicture", { length: 255 }),
  emergencyContactNumber: varchar("EmergencyContactNumber", { length: 20 }),
  createdAt: timestamp("CreatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
