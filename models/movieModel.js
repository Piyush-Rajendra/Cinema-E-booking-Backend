const db = require('../db');

const createMoviesTable = () => {
  return new Promise((resolve, reject) => {
   db.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      cast VARCHAR(255),
      director VARCHAR(255),
      producer VARCHAR(255),
      synopsis TEXT,
      trailerPicture TEXT,
      trailerVideo TEXT,
      mpaaRating VARCHAR(10),
      releaseDate Date,
      showDatesTimes Text,
      posterBase64 TEXT 
    )
  `,
  (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});
};

// Function to insert a new category into the database
const insertCategory = async (categoryData) => {
  const { name } = categoryData;
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to fetch all categories from the database
const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM categories', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const createCategoriesTable = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


const createReviewsTable = () => {
  return new Promise((resolve, reject)=> {
    db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      movie_id INT,
      username VARCHAR(255),
      review TEXT,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    )
  `),
  (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  };
  })
};


const insertMovie = (movieData) => {
  return db.query(
    'INSERT INTO movies (title, category, cast, director, producer, synopsis, trailerPicture, trailerVideo, mpaaRating, releaseDate, showDatesTimes, posterBase64) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
    [
      movieData.title,
      movieData.category,
      movieData.cast,
      movieData.director,
      movieData.producer,
      movieData.synopsis,
      movieData.trailerPicture,
      movieData.trailerVideo,
      movieData.mpaaRating,
      movieData.releaseDate,
      movieData.showDatesTimes,
      movieData.posterBase64,

    ]
  );
};

const deleteMovieById = (movieId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM movies WHERE id = ?', [movieId], (err, result) => {
      if (err) {
        console.error('Error deleting movie:', err);
        reject(err);
      } else {
        console.log('Movie deleted successfully:', result);
        resolve(result);
      }
    });
  });
};

const getAllMovies = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM movies', (err, results) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(results);
      }
    })
  })
};

const getMovieById = (movieId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM movies WHERE id = ?', [movieId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};
const getMovieByName = (movieTitle) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM movies WHERE title = ?', [movieTitle], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        console.log('Query results:', results);
        resolve(results[0]);
      }
    });
  });
};

const getMoviesByCategory = (category) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM movies WHERE category = ?', [category], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        console.log('Query results:', results);
        resolve(results);
      }
    });
  });
};


const insertReview = (reviewData) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO reviews (movie_id, username, review) VALUES (?, ?, ?)',
      [reviewData.movie_id, reviewData.username, reviewData.review],
      (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getReviewsForMovie = (movieId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM reviews WHERE movie_id = ?', [movieId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


const createTables = async () => {
  try {
    await createMoviesTable();
    await createReviewsTable();
    await createCategoriesTable();
  } catch (err) {
    throw err;
  }
};




module.exports = {
  createMoviesTable,
  createReviewsTable,
  getAllMovies,
  insertMovie,
  insertReview,
  getReviewsForMovie,
  getMovieById,
  getMovieByName,
  createTables,
  createCategoriesTable,
  insertCategory,
  getAllCategories,
  getMoviesByCategory,
  deleteMovieById
};

