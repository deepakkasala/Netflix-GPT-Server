const express = require("express");
const {
  getMovieVideos,
  getNowPlayingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
} = require("../controllers/tmdb");
const { validateToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/get-trailers/:movieId", validateToken, getMovieVideos);
router.get("/now-playing-movies", validateToken, getNowPlayingMovies);
router.get("/top-rated-movies", validateToken, getTopRatedMovies);
router.get("/popular-movies", validateToken, getPopularMovies);
router.get("/trending-movies/:trend", validateToken, getTrendingMovies);
router.get("/upcoming-movies", validateToken, getUpcomingMovies);

module.exports = router;
