import express from "express";
import {
  getUser,
  searchUsers,
  updateUser,
  followUser,
  unfollowUser,
} from "../controllers/usersController.js";

import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.use(protect);

router.get("/:username", getUser);
router.get("/search/:query", searchUsers);
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.patch("/:username", upload.single("image"), updateUser);
export default router;
