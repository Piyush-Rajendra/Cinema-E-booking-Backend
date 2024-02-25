const db = require('../db');

const createMoviesTable = () => {
  return db.query(`
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
      showDatesTimes TEXT
      posterBase64 TEXT  -- New column for storing poster as base64
    )
  `);
};


const insertMovie = (movieData) => {
  return db.query(

    'INSERT INTO movies (title, category, cast, director, producer, synopsis, trailerPicture, trailerVideo, mpaaRating, showDatesTimes, posterBase64) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',

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
      movieData.showDatesTimes,
      movieData.posterBase64,
    ]
  );
};


const getAllMovies = () => {
  return new Promise ((resolve, reject)=>{
    db.query('SELECT * FROM movies', (err, results)=> {
      if(err){
        reject(err);
      }
      else{
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






module.exports = {
  createMoviesTable,
  getAllMovies,
  insertMovie,
  insertReview,
  getReviewsForMovie,
  getMovieById,

};

