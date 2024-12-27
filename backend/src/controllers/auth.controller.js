import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { username, password, confirmPassword, email, fullName, gender } =
    req.body;
  try {
    // Validate the required fields
    if (!email || !fullName || !password || !username || !gender) {
      return res.status(200).json({ error: "All Fields are required" });
    }

    // Passwords must match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Password length validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      confirmPassword,
      username,
      gender,
    });

    if (newUser) {
      // Generate JWT token and set it as a cookie
      generateToken(newUser._id, res);
      await newUser.save();

      // Send the user data without the password
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        username: newUser.username,
        gender: newUser.gender,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token and set it as a cookie
    generateToken(user._id, res);

    // Send the user data without the password
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      username: user.username,
      gender: user.gender,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, email } = req.body;
    const userId = req.user._id;

    // Create update object with only provided fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    // Handle profile pic upload if provided
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("Error in Update Profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email presence
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account exists, a reset link will be sent.",
      });
    }

    // Generate token
    const resetToken = randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      rom: `"Wave-Chat" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; padding: 0;">
    <!-- Header with background -->
    <div style="background: linear-gradient(135deg, #015871 0%, #5f857b 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <!-- Logo section -->
        <div style="margin-bottom: 20px;">
            <img src="https://i.postimg.cc/6pYKMLBG/Wave-Chat-svg.png" 
                 alt="Wave Chat Logo" 
                 width="120" 
                 height="120" 
                 style="display: block; margin: 0 auto;">
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Wave Chat</h1>
    </div>

    <!-- Content Container -->
    <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;">
            <tr>
                <td style="padding: 0;">
                    <h2 style="color: #015871; text-align: center; margin: 0 0 30px 0; font-size: 26px; font-weight: 600;">Reset Your Password</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #444444;">Hi there,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #444444;">
                        We received a request to reset your password for your Wave Chat account. If you made this request, please click the button below to reset your password.
                    </p>

                    <!-- Button Container -->
                    <div style="text-align: center; margin: 35px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="border-radius: 50px; background: linear-gradient(135deg, #015871 0%, #5f857b 100%); box-shadow: 0 4px 8px rgba(1,88,113,0.2);">
                                                <a href="${resetLink}" 
                                                   target="_blank"
                                                   style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #f7f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: center; color: #666666;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; text-align: center; word-break: break-all;">
                            <a href="${resetLink}" style="color: #015871; text-decoration: underline;">${resetLink}</a>
                        </p>
                    </div>

                    <div style="background-color: #fff9f0; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #666666;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                    </div>

                    <hr style="border: none; border-top: 1px solid #eef2f5; margin: 30px 0;">

                    <!-- Footer -->
                    <div style="text-align: center; background-color: #f7f9fa; padding: 20px; border-radius: 8px;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #666666;">
                            Need help? Contact our support team at
                            <a href="mailto:jangidhimanshu2000@gmail.com" style="color: #015871; text-decoration: none; font-weight: 600;">support@wavechat.com</a>
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    
    <!-- Footer Branding -->
    <div style="text-align: center; padding: 20px;">
        <p style="font-size: 12px; color: #999999; margin: 0;">
            © 2024 Wave Chat. All rights reserved.
        </p>
    </div>
</div>
    `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);

      // Log success (consider removing in production)
      console.log("Password reset email sent successfully to:", email);

      res.status(200).json({
        message:
          "If an account exists, a password reset link will be sent to your email",
        // Only include debug info in development
        ...(process.env.NODE_ENV === "development" && {
          debug: {
            resetToken,
            resetLink,
          },
        }),
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Remove the reset token if email fails
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      return res.status(500).json({
        error: "Failed to send password reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Received token for verification:", token); // Add this for debugging

    if (!token) {
      console.log("No token provided in request");
      return res.status(400).json({
        error: "Reset token is required",
        valid: false,
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("User found:", user ? "Yes" : "No"); // Add this for debugging

    if (user) {
      console.log("Token expiry:", user.resetTokenExpiry); // Add this for debugging
      console.log("Current time:", Date.now()); // Add this for debugging
    }

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
        valid: false,
      });
    }

    res.json({
      valid: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      error: "Failed to verify reset token",
      valid: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: "Reset token and new password are required",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error: "Failed to reset password",
    });
  }
};

export const changeUsername = async (req, res) => {
  try {
    // Add explicit check for req.user
    if (!req.user || !req.user._id) {
      console.log("User not authenticated:", req.user);
      return res.status(401).json({
        error: "You must be logged in to change username",
        field: "username",
      });
    }

    const { username } = req.body;
    const userId = req.user._id;

    // Log the values for debugging
    console.log("Attempting username change.");

    // Validate username
    if (!username) {
      console.log("Validation failed: Username is required");
      return res.status(400).json({
        error: "Username is required",
        field: "username",
      });
    }
    // Trim the username
    const normalizedUsername = username;

    // Username length and format validation
    if (normalizedUsername.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
        field: "username",
      });
    }

    // Check if username contains valid characters (letters, numbers, underscores)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(normalizedUsername)) {
      console.log("Validation failed: Username can only contain letters, numbers, and underscores");
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores",
        field: "username",
      });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: userId },
    });

    if (existingUser) {
      console.log("Validation failed: Username is already taken");
      return res.status(409).json({
        error: "Username is already taken",
        field: "username",
      });
    }

    // Update the username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: normalizedUsername,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    console.log("Validation passed: Username updated successfully");

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
        field: "username",
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in changeUsername controller:", error.message);
    res.status(500).json({
      error: "Failed to update username. Please try again.",
      field: "username",
    });
  }
};
