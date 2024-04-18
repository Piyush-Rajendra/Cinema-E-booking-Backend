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
router.post('/checkOccupiedSeats', async (req, res) => {
    const { showtimeId, seats } = req.body;

    try {
        const conflictingSeats = await ShowtimeController.checkOccupiedSeats(showtimeId, seats);
        res.status(200).json({ message: "Seats are available.", conflictingSeats: [] });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});



module.exports = router;
