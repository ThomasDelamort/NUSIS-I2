import { eq } from "drizzle-orm";
import { db } from "../lib/db.ts";
import { students } from "../schema/students.schema.ts";
import type { NewStudent, Student } from "../schema/students.schema.ts";

export const createStudent = async (student: NewStudent): Promise<Student> => {
  try {
    const [created] = await db.insert(students).values(student).returning();
    return created!;
  } catch (err: any) {
    console.error("Error creating student:", err);
    throw err;
  }
};

export const getStudentByRfid = async (
  rfid: string,
): Promise<Student | null> => {
  try {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.rfidUid, rfid));
    return student ?? null;
  } catch (err: any) {
    console.error("Error fetching student by RFID:", err);
    throw err;
  }
};

export const getStudents = async (): Promise<Student[] | void> => {
  try {
    return db.query.students.findMany();
  } catch (err: any) {
    console.error("Error fetching students:", err);
    throw err;
  }
};
