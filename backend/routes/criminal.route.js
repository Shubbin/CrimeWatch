import express from "express";
import {
  createCriminal,
  getCriminals,
  updateCriminal,
  deleteCriminal,
} from "../controllers/criminal.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure the uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("mugshot"), createCriminal); 
router.get("/", getCriminals);
router.put("/:id", upload.single("mugshot"), updateCriminal); 
router.delete("/:id", deleteCriminal);

export default router;
