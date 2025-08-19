import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMessages, sendMessages } from "../controllers/messageController.js";

const router = express.Router();

router.use(protect);

router.get("/", getMessages);
router.post("/", sendMessages);

export default router;
