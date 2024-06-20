const express = require('express');
const router = express.Router();
// const { isAuthenticatedUser } = require('../middleware/auth');
const { processPayment, sendStripeApiKey } = require('../controllers/paymentControllers');

router.route("/payment/process").post(processPayment);
router.route('/stripeapikey').get(sendStripeApiKey);
module.exports = router;