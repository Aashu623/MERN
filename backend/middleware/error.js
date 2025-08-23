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

    //JWT authentication error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 401);
    }

    //JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 401);
    }

    //Invalid session token error
    if (err.message?.includes("Invalid or expired session")) {
        const message = `Session expired. Please sign in again.`;
        err = new ErrorHandler(message, 401);
    }

    //File upload error
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = `File size too large. Maximum size is 50MB.`;
        err = new ErrorHandler(message, 413);
    }

    //Request entity too large error
    if (err.message?.includes('request entity too large') || err.statusCode === 413) {
        const message = `Request too large. Please reduce file size or try uploading fewer files.`;
        err = new ErrorHandler(message, 413);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}