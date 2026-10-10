import "dotenv/config";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Same variable names as the Smart Library System, so its .env values can be reused as-is.
const region = process.env["AWS_REGION"];
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"];
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];
const bucketName = process.env["AWS_BUCKET_NAME"];

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error(
    "AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_BUCKET_NAME must be configured",
  );
}

export const bucket: string = bucketName;

// Every file this app uploads lives under this prefix in the bucket.
export const PROFILE_PICTURE_FOLDER = "nusis";

export const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

/**
 * Removes a profile picture by the URL multer-s3 stored for it. Best-effort: a failed delete
 * only leaves an orphaned file behind, so it is logged rather than failing the request.
 */
export const deleteProfilePicture = async (url: string | null | undefined): Promise<void> => {
  if (!url) return;

  let key: string;
  try {
    key = decodeURIComponent(new URL(url).pathname.slice(1));
  } catch {
    return;
  }
  // Never touch objects outside our folder (e.g. the library system's files in the same bucket).
  if (!key.startsWith(`${PROFILE_PICTURE_FOLDER}/`)) return;

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    console.error(`Failed to delete profile picture ${key}:`, err);
  }
};
