const express = require('express')
const stripeController = require("../controllers/stripe")

const api = express.Router()

api.post("/send-email", stripeController.sendEmail)
api.get("/stripe-prices", stripeController.stripePrices)

module.exports = api