import { eq } from "drizzle-orm";
import { db } from "../lib/db.ts";
import { startOfCampusDay } from "../lib/campusTime.ts";
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

/** The student registered to a card, with today's daily logs (oldest first). */
export const getStudentWithTodayLogs = async (rfid: string) => {
  try {
    const student = await db.query.students.findFirst({
      where: { rfidUid: rfid },
      with: {
        dailyLogs: {
          where: { timeIn: { gte: startOfCampusDay() } },
          orderBy: { timeIn: "asc" },
        },
      },
    });
    return student ?? null;
  } catch (err: any) {
    console.error("Error fetching student with today's logs:", err);
    throw err;
  }
};

export const getStudentById = async (studentId: number): Promise<Student | null> => {
  try {
    const student = await db.query.students.findFirst({ where: { studentId } });
    return student ?? null;
  } catch (err: any) {
    console.error("Error fetching student by ID:", err);
    throw err;
  }
};

export const updateStudentProfilePicture = async (
  studentId: number,
  profilePicture: string,
): Promise<Student | null> => {
  try {
    const [updated] = await db
      .update(students)
      .set({ profilePicture })
      .where(eq(students.studentId, studentId))
      .returning();
    return updated ?? null;
  } catch (err: any) {
    console.error("Error updating student profile picture:", err);
    throw err;
  }
};
