import { tapCard } from "../controllers/daily_logs.controller.ts";
import { Router } from "express";

const router = Router();

// Body: { "rfidUid": "..." }. The first tap of a visit records Time In; the next records Time Out.
router.post("/daily-logs/tap", tapCard);

export default router;
