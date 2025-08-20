const express = require('express');
const { clerkClient } = require("@clerk/clerk-sdk-node");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const {
    getUserDetails,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require('../controllers/clerkUserController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/clerkAuth');

const router = express.Router();

// User routes (require authentication)
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

// Admin routes (require authentication and admin role)
router
    .route('/admin/users')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

router
    .route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

// Temporary route to promote user to admin (remove in production)
router.route('/promote-to-admin').post(isAuthenticatedUser, async (req, res, next) => {
    try {
        const { role } = req.body;
        
        // Update the current user's role in Clerk
        const updateData = {
            publicMetadata: { role: role || 'user' }
        };

        await clerkClient.users.updateUser(req.user.clerkId, updateData);

        // Also update the role in our database
        await User.findByIdAndUpdate(req.user.id, { role: role || 'user' });

        res.status(200).json({
            success: true,
            message: "Role updated successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to update role", 500));
    }
});

module.exports = router;
