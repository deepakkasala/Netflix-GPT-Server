require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: compute expiry date based on plan's period
const computeExpiry = (periodValue) => {
  const now = new Date();
  if (periodValue === "day") {
    now.setDate(now.getDate() + 1);
  } else if (periodValue === "month") {
    now.setMonth(now.getMonth() + 1);
  } else {
    // fallback: month
    now.setMonth(now.getMonth() + 1);
  }
  return now;
};

// CREATE ORDER (frontend calls this)
const createOrder = async (req, res) => {
  try {
    const { planId, price, userId } = req.body;
    console.log(req.body);

    if (!planId || !price || !userId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    // Amount must be in paise (INR): price is rupees -> * 100
    const amountInPaise = price * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpay.orders.create(options);

    // return order object to frontend
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// VERIFY PAYMENT (called by frontend after checkout success)
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      userId,
      planMeta,
    } = req.body;

    // Validate presence
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Razorpay fields" });
    }

    // 1) Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.warn("Invalid signature", generatedSignature, razorpay_signature);
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 2) Payment is verified — update user subscription & searchesLeft
    // planMeta contains the GPT info we sent from frontend (search count, period)
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const startsAt = new Date();
    const expiresAt = computeExpiry(planMeta.period);

    user.subscription = {
      planId,
      active: true,
      startsAt,
      expiresAt,
    };

    // set searchesLeft based on plan meta
    user.searchesLeft = planMeta.searches;

    await user.save();

    // Return updated user to client so it can update Redux
    res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated",
      user,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Optional webhook endpoint for server-to-server verification (recommended in prod)
const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  const signature = req.headers["x-razorpay-signature"];

  if (expectedSignature !== signature) {
    return res.status(400).send("invalid signature");
  }

  // process webhook payload: e.g., payment.captured, payment.failed
  // For demo we return success
  return res.status(200).json({ ok: true });
};

module.exports = { createOrder, verifyPayment, razorpayWebhook };
