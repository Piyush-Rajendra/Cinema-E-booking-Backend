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
        MovieStatus,
        showDatesTimes,
        posterBase64,
        end_date  
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
        MovieStatus,
        showDatesTimes,
        posterBase64,
        end_date
      });

      res.json({ message: 'Movie added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

   exports.updateMovieController = async (req, res) => {
    const movieId = req.params.id; // Assuming the movie ID is passed as a route parameter
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
      showDatesTimes,
      MovieStatus,
      posterBase64,
      end_date
    } = req.body;
  
    try {
      await movieModel.updateMovie(
        movieId,
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
        showDatesTimes,
        MovieStatus,
        posterBase64,
        end_date
      );
  
      res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({ error: 'Failed to update movie' });
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

exports.getMoviesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const movies = await movieModel.getMoviesByDate(date);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
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


exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await movieModel.deleteMovieById(movieId);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllTicketPrices = async (req, res) => {
  try {
    const ticketPrices = await movieModel.getAllTicketPrices();
    res.json(ticketPrices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create new ticket price
exports.createTicketPrice = async (req, res) => {
  const { type, price } = req.body;
  try {
    const newTicketPriceId = await movieModel.createTicketPrice(type, price);
    res.json({ id: newTicketPriceId, type, price });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update ticket price
exports.updateTicketPrice = async (req, res) => {
  const { type } = req.params;
  const { price } = req.body;
  try {
    const rowsAffected = await movieModel.updateTicketPrice(type, price);
    if (rowsAffected === 0) {
      return res.status(404).json({ msg: 'Ticket Price not found' });
    }
    res.json({ msg: 'Ticket Price updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTicketPriceByType = async (req, res) => {
  const { type } = req.params;
  try {
    const ticketPrice = await movieModel.getTicketPriceByType(type);
    res.json(ticketPrice);
  } catch (err) {
    console.error(err.message);
    if (err.message === 'Ticket Price not found') {
      return res.status(404).json({ msg: 'Ticket Price not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.updateMovieStatusController = async (req, res) => {
  try {
    await movieModel.updateMovieStatus();
    res.json({ message: 'Movie statuses updated successfully' });
  } catch (error) {
    console.error('Error updating movie status:', error);
    res.status(500).json({ error: 'An error occurred while updating movie status' });
  }
};

exports.updateMovieStatusControllerById = async (req, res) => {
 const {movieId} = req.params;
  const { MovieStatus } = req.body;

  try {
    const result = await movieModel.updateMovieStatusById(movieId, MovieStatus);
    res.json(result);
  } catch (error) {
    console.error('Error updating movie status:', error);
    res.status(500).json({ error: 'An error occurred while updating movie status' });
  }
};