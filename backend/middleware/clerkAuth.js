const { clerkClient } = require("@clerk/clerk-sdk-node");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

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
    const user = await clerkClient.users.getUser(decoded.sub);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Add user data to request object
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      role: user.publicMetadata?.role || "user",
      avatar: user.imageUrl,
    };

    next();
  } catch (error) {
    console.error("Clerk authentication error:", error);
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
