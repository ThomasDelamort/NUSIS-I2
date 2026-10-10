import type { Request, Response } from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentWithTodayLogs,
  updateStudentProfilePicture,
} from "../providers/students.provider.ts";
import { StatusCodes } from "http-status-codes";
import { deleteProfilePicture } from "../lib/s3.ts";
import { PROFILE_PICTURE_FIELD } from "../middleware/multer.middleware.ts";

type rfidType = {
  rfid: string;
};

// Multipart forms send blank optional inputs as "", which should be stored as NULL.
const OPTIONAL_FIELDS = ["contactNumber", "emergencyContactNumber"] as const;

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
  // Set by the uploadProfilePicture middleware when a picture is attached.
  const file = req.file as Express.MulterS3.File | undefined;
  const values = { ...req.body };
  for (const field of OPTIONAL_FIELDS) {
    if (values[field] === "") values[field] = null;
  }
  if (file) values.profilePicture = file.location;

  try {
    const student = await createStudent(values);
    res.status(StatusCodes.CREATED).json({
      message: "Student created successfully",
      data: { student },
    });
  } catch (err: any) {
    // e.g. a duplicate card or email: don't leave the uploaded picture orphaned in S3.
    await deleteProfilePicture(file?.location);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create student",
      error: String(err),
    });
  }
};

export const fetchStudentByRfid = async (req: Request, res: Response): Promise<any> => {
  const { rfid } = req.params as rfidType;
  try {
    // Includes `dailyLogs`: the student's time in/out entries for today.
    const student = await getStudentWithTodayLogs(rfid);
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
};

export const replaceProfilePicture = async (req: Request, res: Response): Promise<any> => {
  const file = req.file as Express.MulterS3.File | undefined;
  if (!file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Attach an image in the "${PROFILE_PICTURE_FIELD}" field`,
    });
  }

  const studentId = Number(req.params["studentId"]);
  try {
    const existing = Number.isInteger(studentId) ? await getStudentById(studentId) : null;
    const student = existing && (await updateStudentProfilePicture(studentId, file.location));
    if (!existing || !student) {
      await deleteProfilePicture(file.location);
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Student not found",
      });
    }

    await deleteProfilePicture(existing.profilePicture);
    res.status(StatusCodes.OK).json({
      message: "Profile picture updated successfully",
      data: { student },
    });
  } catch (err: any) {
    await deleteProfilePicture(file.location);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update profile picture",
      error: String(err),
    });
  }
};
