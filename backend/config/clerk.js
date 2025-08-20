const { clerkClient } = require('@clerk/clerk-sdk-node');

// Initialize Clerk with your secret key
// Make sure to set CLERK_SECRET_KEY in your environment variables
const initializeClerk = () => {
    if (!process.env.CLERK_SECRET_KEY) {
        throw new Error('CLERK_SECRET_KEY is required in environment variables');
    }
    
    return clerkClient;
};

module.exports = { initializeClerk };
