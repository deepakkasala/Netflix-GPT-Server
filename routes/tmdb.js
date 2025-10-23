const express = require("express");
const {
  getMovieVideos,
  getNowPlayingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovie,
  getGenres,
} = require("../controllers/tmdb");
const { validateToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/get-trailers/:movieId", validateToken, getMovieVideos);
router.get("/now-playing-movies", validateToken, getNowPlayingMovies);
router.get("/top-rated-movies", validateToken, getTopRatedMovies);
router.get("/popular-movies", validateToken, getPopularMovies);
router.get("/trending-movies/:trend", validateToken, getTrendingMovies);
router.get("/upcoming-movies", validateToken, getUpcomingMovies);
router.get("/search-movie/:movie", validateToken, searchMovie);
router.get("/genres", validateToken, getGenres);

module.exports = router;
