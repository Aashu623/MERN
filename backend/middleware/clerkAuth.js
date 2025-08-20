const { clerkClient } = require("@clerk/clerk-sdk-node");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify the token with Clerk
    const decoded = await clerkClient.verifyToken(token);
    
    if (!decoded || !decoded.sub) {
      return next(new ErrorHandler("Invalid token", 401));
    }

    // Get user data from Clerk
    const clerkUser = await clerkClient.users.getUser(decoded.sub);

    if (!clerkUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Get user data from database (this will have the correct role)
    let dbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!dbUser) {
      // If user doesn't exist in database, create them
      const userData = {
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: {
          public_id: "default_avatar",
          url: clerkUser.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        },
        role: clerkUser.publicMetadata?.role || 'user'
      };
      
      dbUser = await User.create(userData);
    }

    // Add user data to request object (using database data for role)
    req.user = {
      id: dbUser._id,
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role, // Use role from database
      avatar: dbUser.avatar,
    };

    next();
  } catch (error) {
    // Check if it's a token expiration error
    if (error.reason === 'token-expired') {
      return next(new ErrorHandler("Token expired. Please login again.", 401));
    }
    
    // Check if it's an invalid token error
    if (error.reason === 'token-invalid') {
      return next(new ErrorHandler("Invalid token. Please login again.", 401));
    }
    
    return next(new ErrorHandler("Authentication failed", 401));
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
