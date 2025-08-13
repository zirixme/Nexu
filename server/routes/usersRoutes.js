import express from "express";
import {
  getUser,
  searchUsers,
  updateUser,
} from "../controllers/usersController.js";

import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:username", getUser);
router.get("/search/:query", searchUsers);
router.patch("/:username", upload.single("image"), updateUser);
export default router;
