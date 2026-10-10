import {
  fetchStudents,
  postStudent,
  fetchStudentByRfid,
} from "../controllers/student.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/students/:rfid", fetchStudentByRfid);
router.get("/students", fetchStudents);
router.post("/students", postStudent);

export default router;
