const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/clerkAuth');
const { processPayment, sendStripeApiKey } = require('../controllers/paymentControllers');

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route('/stripeapikey').get(sendStripeApiKey);
module.exports = router;