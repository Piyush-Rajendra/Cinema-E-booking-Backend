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
      reviews,
      trailerPicture,
      trailerVideo,
      mpaaRating,
      showDatesTimes
    } = req.body;

    await movieModel.insertMovie({
      title,
      category,
      cast,
      director,
      producer,
      synopsis,
      reviews,
      trailerPicture,
      trailerVideo,
      mpaaRating,
      showDatesTimes
    });

    res.json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
