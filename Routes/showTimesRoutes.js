const express = require('express');
const ShowtimeController = require('../controllers/showTimesController');
const router = express.Router();


router.post('/showTimes', ShowtimeController.addShowtime);
router.post('/bookTickets', ShowtimeController.addReservation);
router.post('/order-history', ShowtimeController.storeOrderHistory);
router.get('/seats/:showtimeId', ShowtimeController.getBookedSeatsHandler); 
router.get('/order-history/:userId', ShowtimeController.getOrderHistory);
router.get('/showtimes/:movieId', ShowtimeController.getShowtimesByMovieIdController);
router.put('/showtimes/:showtimeId', ShowtimeController.updateShowtimeStartAtController);
router.delete('/showtimes/:showtimeId', ShowtimeController.deleteShowtimeController);
router.post('/checkOccupiedSeats',ShowtimeController.checkOccupiedSeatsController);


module.exports = router;
