// controllers/movieController.js
const movieModel = require('../models/movieModel');

exports.getMovies = async (req, res) => {
  try {
    const movies = await movieModel.getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const {
      title,
      category,
      cast,
      director,
      producer,
      synopsis,
      trailerPicture,
      trailerVideo,
      mpaaRating,
      showDatesTimes,
      posterBase64  // New property for the movie poster
    } = req.body;

    await movieModel.insertMovie({
      title,
      category,
      cast,
      director,
      producer,
      synopsis,
      trailerPicture,
      trailerVideo,
      mpaaRating,
      showDatesTimes,
      posterBase64  // Include the posterBase64 data when calling insertMovie
    });

    res.json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const {
      movie_id,
      username,
      review
    } = req.body;

    await movieModel.insertReview({
      movie_id,
      username,
      review
    });

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getReviewsForMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const reviews = await movieModel.getReviewsForMovie(movieId);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};