const express = require('express');
const ShowtimeController = require('../controllers/showTimesController');
const router = express.Router();


router.post('/showTimes', ShowtimeController.addShowtime);
router.get('/seats/:showtimeId', ShowtimeController.getBookedSeatsHandler); 
router.post('/bookTickets', ShowtimeController.addReservation);
router.post('/order-history', ShowtimeController.storeOrderHistory);
router.get('/order-history/:userId', ShowtimeController.getOrderHistory);



module.exports = router;
