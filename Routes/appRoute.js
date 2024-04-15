// routes/movieRoutes.js
const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/movies', movieController.getMovies);
router.post('/movies', movieController.addMovie);
router.get('/moviesById/:movieId', movieController.getMovieById);
router.get('/movieByName/:title',movieController.getMovieByName)
router.get('/movieByCategory/:category',movieController.getMoviesByCategory)
router.post('/reviews', movieController.addReview);
router.get('/reviews/:movieId', movieController.getReviewsForMovie);
router.post('/movies/categories', movieController.createCategory);
router.get('/movies/categories', movieController.getCategories);
router.delete('/movies/:id', movieController.deleteMovie);
module.exports = router;
