import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { StatusCodes } from "http-status-codes";
import { bucket, PROFILE_PICTURE_FOLDER, s3 } from "../lib/s3.ts";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PROFILE_PICTURE_BYTES = 2 * 1024 * 1024; // 2MB
export const PROFILE_PICTURE_FIELD = "profilePicture";

class InvalidFileTypeError extends Error {}

const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    // Lets browsers render the image inline instead of downloading it.
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      // Generated names: original filenames can collide or contain spaces and odd characters.
      const extension = extname(file.originalname).toLowerCase();
      cb(null, `${PROFILE_PICTURE_FOLDER}/${Date.now()}-${randomUUID()}${extension}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError("Only JPEG, PNG, and WEBP images are allowed"));
    }
  },
  limits: { fileSize: MAX_PROFILE_PICTURE_BYTES },
}).single(PROFILE_PICTURE_FIELD);

/**
 * Uploads an optional `profilePicture` file to S3 under nusis/ and exposes it as `req.file`
 * (its public URL is `req.file.location`). Non-multipart requests pass straight through.
 * Upload errors are answered with JSON instead of Express's default HTML error page.
 */
export const uploadProfilePicture = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: unknown) => {
    if (!err) return next();

    if (err instanceof multer.MulterError || err instanceof InvalidFileTypeError) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "Profile picture must be 2MB or smaller"
          : err.message;
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid profile picture", error: message });
      return;
    }

    console.error("Error uploading profile picture:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to upload profile picture",
      error: String(err),
    });
  });
};
