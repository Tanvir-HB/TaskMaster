import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import asyncHandler from "express-async-handler";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  if (user) {
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const message = `Click <a href="${verificationUrl}">here</a> to verify your email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        html: message
      });
    } catch (error) {
      console.error("Email send fail", error);
      // Continue but warn
    }

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Registered! Please verify your email.",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Verify email
// @route   PUT /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ success: true, message: "Email verified" });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.file) {
      user.profilePicture = req.file.path.startsWith("http")
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    generateToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
