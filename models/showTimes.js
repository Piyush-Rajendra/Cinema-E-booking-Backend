
const db = require('../db');


const createShowtime = (showtimeData) => {
    return new Promise((resolve, reject) => {
        const { startAt, startDate, endDate, movieId } = showtimeData;
        if (!startAt || !startDate || !endDate || !movieId) {
            return reject('startAt, startDate, endDate, and movieId are required.');
        }
        db.query('INSERT INTO showtime (startAt, startDate, endDate, movieId) VALUES (?,?,?,?)', [showtimeData.startAt, showtimeData.startDate, showtimeData.endDate, showtimeData.movieId], (err, result) => {
            if (err) reject(err);
            resolve(result.insertId);
        });
    });
  };
  const getShowtimesByMovieId = (movieId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT startAt FROM showtime WHERE movieId = ?', [movieId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


const updateShowtimeStartAt = (showtimeId, startAt) => {
    return new Promise((resolve, reject) => {
        if (!showtimeId || !startAt) {
            return reject('showtimeId and newStartAt are required.');
        }
        db.query('UPDATE showtime SET startAt = ? WHERE id = ?', [startAt, showtimeId], (err, result) => {
            if (err) reject(err);
            resolve(result.affectedRows > 0); // Resolving true if affectedRows > 0 indicates a successful update
        });
    });
};

const deleteShowtime = (showtimeId) => {
    return new Promise((resolve, reject) => {
        if (!showtimeId) {
            return reject('showtimeId is required.');
        }
        db.query('DELETE FROM showtime WHERE id = ?', [showtimeId], (err, result) => {
            if (err) reject(err);
            resolve(result.affectedRows > 0); // Resolving true if affectedRows > 0 indicates a successful deletion
        });
    });
};
  const getBookedSeats = (showtimeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT seatNumber FROM BookedSeat WHERE showtimeId = ?';
        db.query(sql, [showtimeId], (err, result) => {
            if (err) reject(err);
            const bookedSeats = result.map(row => row.seatNumber);
            resolve(bookedSeats);
        });
    });
};

const addReservation = (reservationData) => {
    return new Promise((resolve, reject) => {
        const { date, startAt, seats, ticketPrice, ticketType, total, movieId, username, phone, showtimeId } = reservationData;
        if (!date || !startAt || !seats || !ticketPrice || !ticketType || !total || !movieId || !username || !phone || !showtimeId) {
            return reject('Missing required fields.');
        }

        // Check if selected seats are already booked for the given showtime
        const selectOccupiedSeatsSql = 'SELECT seatNumber FROM BookedSeat WHERE showtimeId = ? AND seatNumber IN (?)';
        db.query(selectOccupiedSeatsSql, [showtimeId, seats], (err, occupiedSeatsResult) => {
            if (err) return reject(err);
            const occupiedSeats = occupiedSeatsResult.map(row => row.seatNumber);
            const conflictingSeats = seats.filter(seat => occupiedSeats.includes(seat));
            if (conflictingSeats.length > 0) {
                return reject(`Seats ${conflictingSeats.join(',')} are already booked for the selected showtime.`);
            }

            // If no conflicting seats, proceed with adding reservation
            const insertReservationSql = 'INSERT INTO Reservation (date, startAt, seats, ticketPrice, ticketType, total, movieId, username, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertReservationSql, [date, startAt, JSON.stringify(seats), ticketPrice, ticketType, total, movieId, username, phone], (err, result) => {
                if (err) return reject(err);
                const reservationId = result.insertId;
                resolve(reservationId);
            });
        });
    });
}

const addBookedSeats = (showtimeId, seats) => {
    return new Promise((resolve, reject) => {
        seats.forEach(seat => {
            const insertBookedSeatSql = 'INSERT INTO BookedSeat (showtimeId, seatNumber) VALUES (?, ?)';
            db.query(insertBookedSeatSql, [showtimeId, seat], (err, result) => {
                if (err) reject(err);
            });
        });
        resolve();
    });
};

const createOrderHistory = (orderData) => {
    return new Promise((resolve, reject) => {
        const { userId, movieName, price, showDate, cardType, number_of_tickets } = orderData;
        db.query('INSERT INTO order_history (userId, movieName, price, showDate, cardType, number_of_tickets) VALUES (?, ?, ?, ?, ?, ?)', 
            [userId, movieName, price, showDate, cardType,number_of_tickets], 
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
    });
};

const getOrderHistory = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_history WHERE userId = ?', [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};



module.exports  = {
    createShowtime,
    getBookedSeats,
    addReservation,
    addBookedSeats,
    createOrderHistory,
    getOrderHistory,
    getShowtimesByMovieId,
    updateShowtimeStartAt,
    deleteShowtime
}