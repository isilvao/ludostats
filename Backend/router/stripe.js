const express = require('express')
const stripeController = require("../controllers/stripe")

const api = express.Router()

api.get("/getSecretKeyStripe", stripeController.getStripeKey)

module.exports = api