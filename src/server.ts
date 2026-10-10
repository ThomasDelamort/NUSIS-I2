import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import type { Express } from "express";
import type { Request, Response } from "express";
import responseFormatter from "./middleware/responseFormatter.ts";
import { pool } from "./lib/db.ts";

// ROUTES
import studentRoutes from "../src/routes/student.route.ts";
import dailyLogRoutes from "./routes/daily_logs.route.ts";

dotenv.config();

const app: Express = express();
const PORT: string | number = 3000;

// Comma-separated list of origins allowed to call the API from a browser; unset allows any origin.
const corsOrigins = process.env["CORS_ORIGIN"]?.split(",").map((origin) => origin.trim()).filter(Boolean);

// Middlewares
app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(responseFormatter);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ data: { server: "Hello World" } });
});

app.get("/health-checks", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ message: "Server is healthy", data: { status: "OK", database: "connected" } });
  } catch (error) {
    res.status(503).json({ message: "Database unreachable", error: String(error), data: { status: "DEGRADED", database: "disconnected" } });
  }
});

app.use("/api", studentRoutes);
app.use("/api", dailyLogRoutes);

// Fail fast if the database can't be reached instead of serving broken requests.
try {
  await pool.query("SELECT 1");
  console.log("Connected to Postgres");
} catch (error) {
  console.error("Failed to connect to Postgres", error);
  await pool.end();
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
