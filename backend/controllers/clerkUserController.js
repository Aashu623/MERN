const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/userModel');

// SYNC USER WITH DATABASE
exports.syncUserWithDatabase = catchAsyncErrors(async (req, res, next) => {
    try {
        const clerkUser = await clerkClient.users.getUser(req.user.id);
        
        if (!clerkUser) {
            return next(new ErrorHandler("Clerk user not found", 404));
        }
        
        // Check if user exists in database
        let dbUser = await User.findOne({ clerkId: clerkUser.id });
        
        if (!dbUser) {
            // Create new user in database
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
            console.log('New user created in database:', dbUser._id);
        } else {
            // Update existing user with latest Clerk data
            dbUser.name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || dbUser.name;
            dbUser.email = clerkUser.emailAddresses[0]?.emailAddress || dbUser.email;
            dbUser.avatar.url = clerkUser.imageUrl || dbUser.avatar.url;
            dbUser.role = clerkUser.publicMetadata?.role || dbUser.role;
            dbUser.lastSync = new Date();
            await dbUser.save();
            console.log('User updated in database:', dbUser._id);
        }

        const userData = {
            id: dbUser._id,
            clerkId: dbUser.clerkId,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            avatar: dbUser.avatar,
            createdAt: dbUser.createdAt
        };

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Error syncing user with database:', error);
        return next(new ErrorHandler("Failed to sync user with database", 500));
    }
});

// GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        // First sync user with database to ensure they exist
        await exports.syncUserWithDatabase(req, res, next);
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
            const nameParts = name.split(' ');
            updateData.firstName = nameParts[0] || '';
            updateData.lastName = nameParts.slice(1).join(' ') || '';
        }

        const user = await clerkClient.users.updateUser(req.user.id, updateData);

        const userData = {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.emailAddresses[0]?.emailAddress,
            role: user.publicMetadata?.role || 'user',
            avatar: user.imageUrl
        };

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to update profile", 500));
    }
});

// GET ALL USERS -- ADMIN
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await clerkClient.users.getUserList();
        
        const usersData = users.map(user => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.emailAddresses[0]?.emailAddress,
            role: user.publicMetadata?.role || 'user',
            avatar: user.imageUrl,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            users: usersData
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
            return next(new ErrorHandler(`User does not exist with Id : ${req.params.id}`));
        }

        const userData = {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.emailAddresses[0]?.emailAddress,
            role: user.publicMetadata?.role || 'user',
            avatar: user.imageUrl,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            user: userData
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
            publicMetadata: { role: role || 'user' }
        };
        
        if (name) {
            const nameParts = name.split(' ');
            updateData.firstName = nameParts[0] || '';
            updateData.lastName = nameParts.slice(1).join(' ') || '';
        }

        await clerkClient.users.updateUser(req.params.id, updateData);

        res.status(200).json({
            success: true,
            message: "User updated successfully"
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
            message: "User Deleted Successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to delete user", 500));
    }
});
