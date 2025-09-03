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
  deleteComment,
  updateComment,
  getFollowingPosts,
} from "../controllers/postsController.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(protect);

router.post("/", upload.single("image"), createPost);

router.get("/", getPosts);
router.get("/following", getFollowingPosts);
router.get("/:id", getPost);

router.delete("/:id", deletePost);

router.patch("/:id", upload.single("image"), updatePost);

router.post("/:postId/like", toggleLike);

router.post("/:postId/comments", addComment);
router.get("/:postId/comments", getComments);
router.delete("/comments/:commentId", deleteComment);
router.patch("/comments/:commentId", updateComment);
export default router;
