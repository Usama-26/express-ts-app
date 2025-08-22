import { Router } from "express";

import {
  login,
  sendOTP,
  signup,
  verifyOTP,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup, sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);
router.post("/login", login);
export default router;
