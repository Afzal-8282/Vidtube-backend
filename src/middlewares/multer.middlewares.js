import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join(process.cwd(), "public", "temp")

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, {recursive: true})
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  // },
  // fileFilter: function (req, file, cb) {
  //   if (file.mimetype.startsWith("image/")) {
  //     cb(null, true); // Accept the file
  //   } else {
  //     cb(new Error("Only image files are allowed!"), false); // Reject the file
  //   }
  // },
});
