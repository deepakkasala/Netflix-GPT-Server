const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  planId: { type: String },
  active: { type: Boolean, default: false },
  startsAt: { type: Date },
  expiresAt: { type: Date },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchList: { type: [Number], default: [] },
  subscription: { type: subscriptionSchema, default: {} },
  searchesLeft: { type: Number, default: 0 }, // GPT searches remaining
  // optionally store period to auto-refill logic later
});

const User = mongoose.model("User", userSchema);

module.exports = User;
