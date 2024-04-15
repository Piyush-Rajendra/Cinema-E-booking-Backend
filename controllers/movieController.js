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
        releaseDate,
        posterBase64  
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
        releaseDate,
        posterBase64  
      });

      res.json({ message: 'Movie added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      await movieModel.insertCategory({ name });
      res.json({ message: 'Category added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.getCategories = async (req, res) => {
    try {
      const categories = await movieModel.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


exports.addReview = async (req, res) => {
  try {
    const { movie_id, username, review } = req.body;

  
    const movie = await movieModel.getMovieById(movie_id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    await movieModel.insertReview({
      movie_id,
      username,
      review,
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



exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const movie = await movieModel.getMovieById(movieId);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMovieByName = async (req, res) => {
  try {
    const movieTitle = req.params.title;
    console.log('Movie title:', movieTitle);

    const movie = await movieModel.getMovieByName(movieTitle);
    console.log('Movie result:', movie);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMovieByName = async (req, res) => {
  try {
    const movieTitle = req.params.title;
    console.log('Movie title:', movieTitle);

    const movie = await movieModel.getMovieByName(movieTitle);
    console.log('Movie result:', movie);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMovieByName = async (req, res) => {
  try {
    const movieTitle = req.params.title;
    console.log('Movie title:', movieTitle);

    const movie = await movieModel.getMovieByName(movieTitle);
    console.log('Movie result:', movie);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// movieController.js


exports.getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const movies = await movieModel.getMoviesByCategory(category);
    if (movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).json({ message: 'No movies found in the specified category' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
