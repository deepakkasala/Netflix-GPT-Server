const express = require("express");
const generateContent = require("../controllers/ai");
const { validateToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/generate-ai-response", generateContent);

module.exports = router;
