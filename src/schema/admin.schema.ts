import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  adminId: integer("admin_id").primaryKey().generatedAlwaysAsIdentity(),
  refidUid: varchar("refid_uid", { length: 15 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  universityEmail: varchar("university_email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  profilePictureUrl: varchar("profile_picture_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Admin = typeof admin.$inferSelect;
export type NewAdmin = typeof admin.$inferInsert;
