const express = require("express");
const {
  registerUser,
  loginUser,
  addMovieToWatchList,
  removeMovieFromWatchList,
  decrementSearch,
} = require("../controllers/auth");
const { validateToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/add-to-watchlist/:movieId", validateToken, addMovieToWatchList);
router.post(
  "/remove-from-watchlist/:movieId",
  validateToken,
  removeMovieFromWatchList
);
router.post("/decrement-search", validateToken, decrementSearch);
module.exports = router;
