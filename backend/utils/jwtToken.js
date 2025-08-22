const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site requests in production
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined, // Set domain in production
    path: '/', // Ensure cookie is available across the entire domain
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
