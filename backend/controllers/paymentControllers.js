const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const stripe = require('stripe');

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    console.log("Procespayment started")
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: {
            company: "Ecommerce",
        },
    });

    console.log("payment done");

    res.status(200).json({ sucess: true, client_secret: myPayment.client_secret })
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
})