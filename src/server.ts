import "dotenv/config";
import express from "express";
import type { Express } from "express";
import type { Request, Response } from "express";
import responseFormatter from "./middleware/responseFormatter.ts";

const app: Express = express();
const PORT: string | number = 3000;

// Middlewares
app.use(express.urlencoded());
app.use(responseFormatter);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ server: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
