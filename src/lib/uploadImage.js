import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

// Any uploaded photo gets downscaled to this before saving — plenty for
// profile cards, full-profile views, and photo galleries, and far lighter
// than an original phone-camera photo (which can be 3-5MB).
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 78;

// Saves a "data:image/...;base64,...." string to public/uploads/<subfolder>/
// and returns the public URL path (e.g. "/uploads/profiles/ab12cd.jpg") to
// store in the database instead of the raw base64 data. Storing the raw
// base64 in MongoDB is what caused every profile-listing query to load slow,
// heavy documents off disk — actual files on disk (served statically by
// Next.js) are far cheaper to query and transfer.
//
// The image is also resized/compressed here (via sharp) before it's written
// to disk. Uploads were previously saved at their original size — often
// several MB straight from a phone camera — which is what made every page
// showing profile photos (home, search, active profiles, dashboard) slow to
// load. Everything now gets normalized to a single lightweight JPEG.
export async function saveDataUrlAsFile(dataUrl, subfolder) {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data.");
  }
  const [, , base64Data] = match;

  const dir = path.join(UPLOAD_ROOT, subfolder);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.jpg`;
  const filePath = path.join(dir, filename);

  const inputBuffer = Buffer.from(base64Data, "base64");
  const optimized = await sharp(inputBuffer)
    .rotate() // respect the original EXIF orientation before stripping it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  await fs.writeFile(filePath, optimized);

  return `/uploads/${subfolder}/${filename}`;
}

// Best-effort delete — never throws, since a missing/already-deleted file
// (or a legacy base64 URL that isn't a real file) shouldn't block the DB update.
export async function deleteUploadedFile(urlPath) {
  try {
    if (!urlPath || !urlPath.startsWith("/uploads/")) return;
    const filePath = path.join(process.cwd(), "public", urlPath);
    await fs.unlink(filePath);
  } catch {
    // ignore — file may not exist, or this was a legacy base64 entry
  }
}
