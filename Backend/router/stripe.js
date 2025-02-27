const express = require('express')
const stripeController = require("../controllers/stripe")

const api = express.Router()

api.post("/send-email", stripeController.sendEmail)
api.get("/stripe-prices", stripeController.stripePrices)
api.get("/is-payment-successful", stripeController.isPaymentSuccessful)
api.post("/webhook", stripeController.webhook)
api.get('/user-has-subscription/:user_id', stripeController.userHasSubscription)

module.exports = api