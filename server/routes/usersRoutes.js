import express from "express";
import { getUser, searchUsers } from "../controllers/usersController.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/search/:query", searchUsers);
export default router;
