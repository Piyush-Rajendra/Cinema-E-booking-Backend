// routes/movieRoutes.js
const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/movies', movieController.getMovies);
router.post('/movies', movieController.addMovie);
router.get('/:movieId', movieController.getMovieById);
router.post('/reviews', movieController.addReview);
router.get('/reviews/:movieId', movieController.getReviewsForMovie);
module.exports = router;
