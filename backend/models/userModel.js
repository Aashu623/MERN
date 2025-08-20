const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: [true, "Clerk User ID is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Please Enter You Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validator: [validator.isEmail, "Please Enter a valid Email"],
    },
    avatar: {
        public_id: {
            type: String,
            default: "default_avatar"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastSync: {
        type: Date,
        default: Date.now
    }
});

// Note: Password handling is now managed by Clerk
// This schema is for storing additional user data and syncing with Clerk

module.exports = mongoose.model('User', userSchema);