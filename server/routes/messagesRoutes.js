import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getChatUsers,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(protect);
router.get("/", getChatUsers), router.get("/:id", getMessages);
router.post("/", sendMessage);


export default router;
