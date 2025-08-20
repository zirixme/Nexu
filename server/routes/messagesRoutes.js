import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.use(protect);

router.get("/", getMessages);
router.post("/", sendMessage);

export default router;
