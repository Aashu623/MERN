const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../models/userModel");

// GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get user from database (user is already set by authentication middleware)
    const dbUser = await User.findById(req.user.id);

    if (!dbUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    const userData = {
      id: dbUser._id,
      clerkId: dbUser.clerkId,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar,
      createdAt: dbUser.createdAt,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get user details", 500));
  }
});

// UPDATE USER PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updateData = {};

    if (name) {
      const nameParts = name.split(" ");
      updateData.firstName = nameParts[0] || "";
      updateData.lastName = nameParts.slice(1).join(" ") || "";
    }

    const user = await clerkClient.users.updateUser(req.user.id, updateData);

    const userData = {
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata?.role || "user",
      avatar: user.imageUrl,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update profile", 500));
  }
});

// GET ALL USERS -- ADMIN
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find();
    const usersData = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      success: true,
      users: usersData,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get users", 500));
  }
});

// GET SINGLE USER -- ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await clerkClient.users.getUser(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id : ${req.params.id}`)
      );
    }

    const userData = {
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata?.role || "user",
      avatar: user.imageUrl,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get user", 500));
  }
});

// UPDATE USER ROLE -- ADMIN
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const updateData = {
      publicMetadata: { role: role || "user" },
    };

    if (name) {
      const nameParts = name.split(" ");
      updateData.firstName = nameParts[0] || "";
      updateData.lastName = nameParts.slice(1).join(" ") || "";
    }

    await clerkClient.users.updateUser(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update user", 500));
  }
});

// DELETE USER -- ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    await clerkClient.users.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete user", 500));
  }
});
