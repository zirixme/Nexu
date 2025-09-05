import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(protect);
router.post("/", sendMessage);
router.get("/", getConversations);
router.get("/:otherUserId", getMessages);

export default router;
