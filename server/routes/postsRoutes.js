import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  toggleLike,
  addComment,
  getComments,
  getPost,
} from "../controllers/postsController.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(protect);

router.post("/", upload.single("image"), createPost);

router.get("/", getPosts);
router.get("/:id", getPost);

router.delete("/:id", deletePost);

router.patch("/:id", updatePost);

router.post("/:postId/like", toggleLike);

router.post("/:postId/comments", addComment);
router.get("/:postId/comments", getComments);

export default router;
