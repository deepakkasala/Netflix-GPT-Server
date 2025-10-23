const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const tmdbRoutes = require("./routes/tmdb");

const app = express();
app.use(express.json());
app.use(cors());

//routes

app.use("/auth", authRoutes); // "/auth/login" or "/auth/register"
app.use("/ai", aiRoutes);
app.use("/tmdb", tmdbRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
