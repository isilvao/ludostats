
function getStripeKey(req, res) {
    res.json({ key: process.env.STRIPE_SECRET_KEY });
}

module.exports = {
    getStripeKey,
}