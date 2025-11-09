const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully! Please log in.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        watchList: user.watchList,
        subscription: user.subscription,
        searchesLeft: user.searchesLeft,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res
      .status(200)
      .json({ message: "User info retrieved", success: true, user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const addMovieToWatchList = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    console.log(movieId, userId);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.watchList.includes(movieId)) {
      return res
        .status(400)
        .json({ message: "Movie already in watchlist", success: false });
    }

    user.watchList.push(Number(movieId));
    await user.save();

    res
      .status(200)
      .json({ message: "Movie added to watchlist", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const removeMovieFromWatchList = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    console.log("Removing movie:", movieId, "for user:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Convert to Number (since you stored movieId as Number)
    const numericMovieId = Number(movieId);

    // Check if the movie exists in the user's watchlist
    if (!user.watchList.includes(numericMovieId)) {
      return res
        .status(400)
        .json({ message: "Movie not found in watchlist", success: false });
    }

    // Remove the movie ID
    user.watchList = user.watchList.filter((id) => id !== numericMovieId);
    await user.save();

    res.status(200).json({
      message: "Movie removed from watchlist",
      success: true,
      watchList: user.watchList,
    });
  } catch (error) {
    console.error("Error removing movie from watchlist:", error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const decrementSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Decrementing search for user:", userId);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false });
    console.log(user);

    if (user.searchesLeft <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No searches left" });
    }

    user.searchesLeft -= 1;
    console.log(user);

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addMovieToWatchList,
  removeMovieFromWatchList,
  decrementSearch,
  getUserInfo,
};
