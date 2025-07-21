import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/postsController.js";

const router = express.Router();

router.use(protect);

router.post("/", createPost);

router.get("/", getPosts);

router.delete("/:id", deletePost);

router.patch("/:id", updatePost);

export default router;
