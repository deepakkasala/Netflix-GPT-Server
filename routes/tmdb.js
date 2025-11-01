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
  getLanguages,
  getExternalMovieIds,
  getMovieDetailsByImdbId,
  getMovieDetailsByTmdbId,
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
router.get("/languages", validateToken, getLanguages);
router.get("/get-external-ids/:movie_id", validateToken, getExternalMovieIds);
router.get("/movie-details/:imdbId", validateToken, getMovieDetailsByImdbId);
router.get(
  "/movie-details-tmdb/:movie_id",
  validateToken,
  getMovieDetailsByTmdbId
);
module.exports = router;
