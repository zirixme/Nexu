import express from "express";

import {
  signup,
  signin,
  refresh,
  signout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh", refresh);
router.post("/signout", signout);
export default router;
