import { rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

// Per client IP. A kiosk sends one lookup per card scan plus a roster refresh every few
// minutes, so this leaves plenty of headroom for a busy entrance while stopping floods.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

export const apiRateLimit = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_REQUESTS_PER_WINDOW,
  // Sends the RateLimit and RateLimit-Policy headers so clients can see when to retry.
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // Use res.json so the response gets the same envelope as every other API response.
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json({
      message: "Too many requests, please try again in a minute",
    });
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});
