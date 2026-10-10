import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { recordTap } from "../providers/daily_logs.provider.ts";
import { getStudentWithTodayLogs } from "../providers/students.provider.ts";

export const tapCard = async (req: Request, res: Response): Promise<any> => {
  const rfidUid = req.body?.rfidUid;
  if (typeof rfidUid !== "string" || rfidUid.trim() === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Send the scanned card as "rfidUid"',
    });
  }

  try {
    const result = await recordTap(rfidUid.trim());
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Student not found",
      });
    }

    // Same shape as GET /api/students/:rfid, so the dashboard can show the updated times.
    const student = await getStudentWithTodayLogs(rfidUid.trim());
    res.status(StatusCodes.OK).json({
      message: result.action === "time-in" ? "Timed in" : "Timed out",
      data: { action: result.action, log: result.log, student },
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to record tap",
      error: String(err),
    });
  }
};
