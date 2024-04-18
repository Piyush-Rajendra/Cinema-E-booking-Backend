const showTimesModel = require('../models/showTimes');


exports.addShowtime = async (req, res) => {
    try { 
        const {
            startAt,
            startDate,
            endDate,
            movieId
        } = req.body;

        if (!startAt || !startDate || !endDate || !movieId) {
            return res.status(400).json({ error: 'Missing required fields. Please provide startAt, startDate, endDate, and movieId.' });
        }

        await showTimesModel.createShowtime({
            startAt,
            startDate,
            endDate,
            movieId
        });

        res.json({ message: 'Showtime added successfully' });
    } catch (error) {
        console.error('Error adding showtime:', error);
        res.status(500).json({ error: 'An unexpected error occurred while adding showtime.' });
    }
};

exports.updateShowtimeStartAtController = (req, res) => {
    const {  startAt } = req.body;
    const { showtimeId} = req.params;
    showTimesModel.updateShowtimeStartAt(showtimeId, startAt)
        .then((updated) => {
            if (updated) {
                res.status(200).json({ success: true, message: 'Showtime startAt updated successfully' });
            } else {
                console.log(showtimeId, startAt);
                res.status(404).json({ success: false, message: 'No showtime found with the provided ID' });
            }
        })
        .catch((err) => {
            console.log(showtimeId, startAt);
            res.status(500).json({ success: false, message: 'Error updating showtime startAt', error: err });
        });
};

exports.deleteShowtimeController = (req, res) => {
    const { showtimeId } = req.params;
    showTimesModel.deleteShowtime(showtimeId)
        .then((deleted) => {
            if (deleted) {
                res.status(200).json({ success: true, message: 'Showtime deleted successfully' });
            } else {
                res.status(404).json({ success: false, message: 'No showtime found with the provided ID' });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: 'Error deleting showtime', error: err });
        });
};

exports.getShowtimesByMovieIdController = async (req, res) => {
    const { movieId } = req.params;
    try {
        const showtimes = await showTimesModel.getShowtimesByMovieId(movieId);
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getBookedSeatsHandler = async (req, res) => {
    try {
        const { showtimeId } = req.params;
        const bookedSeats = await showTimesModel.getBookedSeats(showtimeId);
        res.json({ bookedSeats });
    } catch (error) {
        console.error('Error getting booked seats:', error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching booked seats.' });
    }
};

exports.addReservation = async (req, res) => {
    try { 
        const {
            date,
            startAt,
            seats,
            ticketPrice,
            ticketType,
            total,
            movieId,
            username,
            phone,
            showtimeId
        } = req.body;

        if (!date || !startAt || !seats || !ticketPrice || !ticketType || !total || !movieId || !username || !phone || !showtimeId) {
            return res.status(400).json({ error: 'Missing required fields. Please provide date, startAt, seats, ticketPrice, ticketType, total, movieId, username, and phone.' });
        }
     await showTimesModel.addReservation(req.body);


    await showTimesModel.addBookedSeats(req.body.showtimeId, req.body.seats);

        res.json({ message: 'Reservation added successfully', showtimeId });
    } catch (error) {
        console.error('Error adding reservation: ', error);
        res.status(500).json({ error});
    }
};
// Controller function to check if seats are occupied
exports.checkOccupiedSeatsController = async (req, res) => {
   
    try {
        const { showtimeId, seats } = req.body;
        const conflictingSeats = await showTimesModel.checkOccupiedSeats(showtimeId, seats);
        
        if (conflictingSeats.length > 0) {
            res.status(409).json({ message: `Seats ${conflictingSeats.join(', ')} are already booked for the selected showtime.` });
        } else {
            console.log(seats)
            res.status(200).json({ message: 'Selected seats are available.' });
        }
    } catch (error) {
        console.error('Error checking occupied seats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.storeOrderHistory = async (req, res) => {
    try {
        const { userId, movieName, price, showDate, cardType, number_of_tickets } = req.body;

        // Store order history in the database
        await showTimesModel.createOrderHistory({
            userId,
            movieName,
            price,
            showDate,
            cardType,
            number_of_tickets
        });

        res.json({ message: 'Order history stored successfully' });
    } catch (error) {
        console.error('Error storing order history:', error);
        res.status(500).json({ error: 'An unexpected error occurred while storing order history' });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch order history for the specified user
        const orderHistory = await showTimesModel.getOrderHistory(userId);

        res.json(orderHistory);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching order history' });
    }
};