import {
  fetchStudents,
  postStudent,
  fetchStudentByRfid,
  replaceProfilePicture,
} from "../controllers/student.controller.ts";
import { uploadProfilePicture } from "../middleware/multer.middleware.ts";
import { Router } from "express";

const router = Router();

router.get("/students/:rfid", fetchStudentByRfid);
router.get("/students", fetchStudents);
// Accepts JSON, or multipart form data with an optional "profilePicture" image.
router.post("/students", uploadProfilePicture, postStudent);
router.put("/students/:studentId/profile-picture", uploadProfilePicture, replaceProfilePicture);

export default router;
