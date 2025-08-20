const express = require('express');
const {
    getUserDetails,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    syncUserWithDatabase
} = require('../controllers/clerkUserController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/clerkAuth');

const router = express.Router();

// User routes (require authentication)
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/sync').post(isAuthenticatedUser, syncUserWithDatabase);
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

module.exports = router;
