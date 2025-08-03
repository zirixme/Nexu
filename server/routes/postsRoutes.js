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
} from "../controllers/postsController.js";

const router = express.Router();

router.use(protect);

router.post("/", createPost);

router.get("/", getPosts);

router.delete("/:id", deletePost);

router.patch("/:id", updatePost);

router.post("/:postId/like", toggleLike);

router.post("/:postId/comments", addComment);
router.get("/:postId/comments", getComments);

export default router;
