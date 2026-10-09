import type { Request, Response } from "express";
import { createStudent, getStudents, getStudentByRfid } from "../providers/students.provider.ts";
import { StatusCodes } from "http-status-codes";
import type { Student } from "../schema/students.schema.ts";

type rfidType = {
  rfid: string;
};

export const fetchStudents = async (_req: Request, res: Response) => {
  try {
    const students = await getStudents();
    res.status(StatusCodes.OK).json({
      message: "Students fetched successfully",
      data: { students },
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch students",
      error: String(err),
    });
  }
};

export const postStudent = async (req: Request, res: Response) => {
  try {
    const student = await createStudent(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "Student created successfully",
      data: { student },
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create student",
      error: String(err),
    });
  }
};

export const fetchStudentByRfid = async (req: Request, res: Response): Promise<any> => {
  const { rfid } = req.params as rfidType;
  try {
    const student: Student | null = await getStudentByRfid(rfid);
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Student not found",
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Student fetched successfully",
      data: { student },
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch student",
      error: String(err),
    });
  }
}