const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb ID error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Clerk authentication error
    if (err.name === "ClerkError" || err.message?.includes("Clerk")) {
        const message = `Authentication failed. Please try again.`;
        err = new ErrorHandler(message, 401);
    }

    //Invalid session token error
    if (err.message?.includes("Invalid or expired session")) {
        const message = `Session expired. Please sign in again.`;
        err = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}