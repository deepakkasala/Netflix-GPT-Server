const axios = require("axios");
const { API_OPTIONS } = require("../utils/constants");
const getMovieVideos = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    const trailers = data.results.filter((video) => video.type === "Trailer");
    // console.log(trailers);
    res.status(200).json({ success: true, trailers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing?page=1",
      API_OPTIONS
    );
    // console.log(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/top_rated?page=1",
      API_OPTIONS
    );
    // console.log(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/popular?page=1",
      API_OPTIONS
    );
    // console.log(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getTrendingMovies = async (req, res) => {
  try {
    const { trend } = req.params;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/${trend}`,
      API_OPTIONS
    );
    // console.log(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getUpcomingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming?page=1",
      // "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=te-IN&page=1&sort_by=popularity.desc",
      API_OPTIONS
    );
    // console.log(data.data.results);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const searchMovie = async (req, res) => {
  try {
    const { movie } = req.params;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

  //   console.log(data);
};

const getGenres = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      API_OPTIONS
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  getMovieVideos,
  getNowPlayingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovie,
  getGenres,
};
