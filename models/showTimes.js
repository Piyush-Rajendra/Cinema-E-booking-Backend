
const db = require('../db');


const createShowtime = (showtimeData) => {
    return new Promise((resolve, reject) => {
        const { startAt, startDate, endDate, movieId } = showtimeData;
        if (!startAt || !startDate || !endDate || !movieId) {
            return reject('startAt, startDate, endDate, and movieId are required.');
        }
        
        // Check if a showtime with the same startAt already exists for the given movieId
        db.query('SELECT COUNT(*) AS count FROM showtime WHERE movieId = ? AND startAt = ?', [movieId, startAt], (err, results) => {
            if (err) {
                return reject(err);
            }
            const existingCount = results[0].count;
            if (existingCount > 0) {
                return reject('A showtime for this movie with the same start time already exists.');
            }
            
            // If no existing showtime found, proceed to insert the new showtime
            db.query('INSERT INTO showtime (startAt, startDate, endDate, movieId) VALUES (?,?,?,?)', [startAt, startDate, endDate, movieId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    });
};

  const getShowtimesByMovieId = (movieId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT startAt, id FROM showtime WHERE movieId = ?', [movieId], (err, results) => {
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

        // Split seat numbers into individual seats
        const seatArray = seats.flatMap(seatGroup => seatGroup.split(',').map(seat => seat.trim()));

        // Check if selected seats are already booked for the given showtime
        const selectOccupiedSeatsSql = `SELECT seatNumber FROM BookedSeat WHERE showtimeId = ? AND seatNumber IN (${seatArray.map(() => '?').join(', ')})`;
        db.query(selectOccupiedSeatsSql, [showtimeId, ...seatArray], (err, occupiedSeatsResult) => {
            if (err) return reject(err);
            const occupiedSeats = occupiedSeatsResult.map(row => row.seatNumber);

            const conflictingSeats = [];
            seatArray.forEach(seat => {
                if (occupiedSeats.includes(seat)) {
                    conflictingSeats.push(seat);
                }
            });

            if (conflictingSeats.length > 0) {
                return reject(`Seats ${conflictingSeats.join(',')} are already booked for the selected showtime.`);
            }

            // If no conflicting seats, proceed with adding reservation
            const insertReservationSql = 'INSERT INTO Reservation (date, startAt, seats, ticketPrice, ticketType, total, movieId, username, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertReservationSql, [date, startAt, JSON.stringify(seatArray), ticketPrice, ticketType, total, movieId, username, phone], (err, result) => {
                if (err) return reject(err);
                const reservationId = result.insertId;
                resolve(reservationId);
            });
        });
    });
}
const checkOccupiedSeats = (showtimeId, seats) => {
    return new Promise((resolve, reject) => {
        // Convert seat numbers into a flat array
        const seatArray = seats.flatMap(seatGroup => seatGroup.split(',').map(seat => seat.trim()));

        // Check if selected seats are already booked for the given showtime
        const selectOccupiedSeatsSql = `SELECT seatNumber FROM bookedSeat WHERE showtimeId = ? AND seatNumber IN (${seatArray.map(() => '?').join(', ')})`;
        
        db.query(selectOccupiedSeatsSql, [showtimeId, ...seatArray], (err, occupiedSeatsResult) => {
            if (err) return reject(err);

            const occupiedSeats = occupiedSeatsResult.map(row => row.seatNumber);
          
            const conflictingSeats = seatArray.filter(seat => occupiedSeats.includes(seat));

            resolve(conflictingSeats);
        });
    });
};


const addBookedSeats = (showtimeId, seats) => {
    return new Promise((resolve, reject) => {
        const promises = seats.map(seat => {
            return new Promise((resolve, reject) => {
                const insertBookedSeatSql = 'INSERT INTO bookedSeat (showtimeId, seatNumber) VALUES (?, ?)';
                db.query(insertBookedSeatSql, [showtimeId, seat], (err, result) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        Promise.all(promises)
            .then(() => resolve())
            .catch(err => reject(err));
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
    deleteShowtime,
    checkOccupiedSeats
}