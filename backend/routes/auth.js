import express from "express";
import { registerUser, loginUser, verifyEmail, updateUserProfile, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/verifyemail/:token", verifyEmail);
router.put("/profile", protect, upload.single("profilePicture"), updateUserProfile);

export default router;
