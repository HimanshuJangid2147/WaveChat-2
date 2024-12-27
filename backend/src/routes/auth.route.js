import express from "express";
import {
  changeUsername,
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
  verifyResetToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password", resetPassword);
router.put("/change-username", protectRoute, changeUsername);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
