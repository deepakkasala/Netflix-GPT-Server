const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} = require("../controllers/payment");
const { validateToken } = require("../middlewares/auth"); // use your auth middleware

router.post("/create-order", validateToken, createOrder); // expects planId, price, userId in body
router.post("/verify-payment", validateToken, verifyPayment);

// If you want webhook (no auth)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

module.exports = router;
