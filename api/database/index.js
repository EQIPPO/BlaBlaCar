const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const password_hash = (password) => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

const validate_password = (password, hash) => {
    return password_hash(password) === hash;
}

module.exports = (context) => {
    console.log('⚙️ Database connected');

    const isAdmin = async (user_id) => {
        try {
            const result = await context.findUserById(user_id);
            if (result.length === 0)
                return false;

            return result[0].is_admin;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

    return {
        login: async (username, password) => {
            try {
                const result = await context.findUser(username);
                if (result.length === 0) {
                    return {
                        status: 401,
                        message: 'Login or password are incorrect'
                    };
                }

                const user = result[0];
                if (!validate_password(password, user.password)) {
                    return {
                        status: 401,
                        message: 'Login or password are incorrect'
                    };
                }

                const token = jwt.sign({
                    id: user.id,
                    login: user.login
                }, process.env.SECRET_KEY);

                return {
                    status: 200,
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        name: user.name,
                        login: user.login
                    }
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        register: async (username, password, name) => {
            try {
                if (password.length < 8) {
                    return {
                        status: 400,
                        message: 'Password must be at least 8 characters long'
                    };
                }

                const result = await context.findUser(username);
                if (result.length !== 0) {
                    return {
                        status: 400,
                        message: 'User already exists'
                    };
                }

                const user_id = await context.createUser(username, password_hash(password), name);
                const token = jwt.sign({
                    id: user_id,
                    login: username
                }, process.env.SECRET_KEY);

                return {
                    status: 200,
                    message: 'Registration successful',
                    token: token,
                    user: {
                        id: user_id,
                        name: name,
                        login: username
                    }
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        changeName: async (name, token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                await context.changeName(user.id, name);
                return {
                    status: 200,
                    message: 'Name changed successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getRatings: async (user_id) => {
            try {
                const user = await context.findUserById(user_id);
                if (user.length === 0) {
                    return {
                        status: 404,
                        message: 'User does not exist'
                    };
                }

                const result = await context.getRatings(user_id);
                let sum = 0;
                for (let i = 0; i < result.length; i++) {
                    sum += result[i].rating;
                }
                const average = sum / result.length;

                return {
                    status: 200,
                    message: 'Ratings retrieved successfully',
                    name: user[0].name,
                    created_at: user[0].created_at,
                    ratings: result,
                    average: average ? average : 0
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        addRating: async (user_id, rating, content, token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (user.id == user_id) {
                    return {
                        status: 400,
                        message: 'You cannot rate yourself'
                    };
                }

                await context.addRating(user_id, user.id, rating, content);
                return {
                    status: 200,
                    message: 'Rating added successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getTrips: async (options, token) => {
            try {
                const result = await context.getTrips(options, token);

                // only show trips that are not reserved or reserved by the user
                let reservations = [];
                for (let i = 0; i < result.length; i++) {
                    const trip = result[i];
                    reservations.push(await context.getReservations(trip.id));
                }

                let user = null;
                if (token) {
                    user = jwt.verify(token, process.env.SECRET_KEY);
                    if (!user) {
                        return {
                            status: 401,
                            message: 'Unauthorized'
                        };
                    }
                }

                // if it's already reserved, check if it's reserved by the user
                let filtered = [];
                for (let i = 0; i < result.length; i++) {
                    const trip = result[i];
                    let reserved = false;
                    for (let j = 0; j < reservations[i].length; j++) {
                        if (reservations[i][j].status == 1) {
                            // check if it's reserved by the user or this is driver's trip
                            if (!(user && (reservations[i][j].user_id == user.id || trip.driver_id == user.id))) {
                                reserved = true;
                                break;
                            }
                        }
                    }
                    if (!reserved) {
                        filtered.push(trip);
                    }
                }

                return {
                    status: 200,
                    message: 'Trips retrieved successfully',
                    trips: filtered
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getTrip: async (id, token) => {
            try {
                const result = await context.getTrip(id);
                if (result.length === 0) {
                    return {
                        status: 404,
                        message: 'Trip not found'
                    };
                }

                let user = null;
                if (token) {
                    user = jwt.verify(token, process.env.SECRET_KEY);
                    if (!user) {
                        return {
                            status: 401,
                            message: 'Unauthorized'
                        };
                    }
                }

                const reservations = await context.getReservations(id);
                for (let i = 0; i < reservations.length; i++) {
                    if (reservations[i].status === 1) {
                        if (user && (user.id === reservations[i].user_id || user.id === result[0].driver_id)) {
                            reservations[i].reserved = true;
                        }
                        else {
                            return {
                                status: 401,
                                message: 'This trip is already reserved by another user'
                            };
                        }
                    }
                }


                return {
                    status: 200,
                    message: 'Trip retrieved successfully',
                    trip: result[0]
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        addTrip: async (options, token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const id = await context.addTrip(
                    user.id,
                    options.start,
                    options.end,
                    options.time,
                    options.passengers,
                    options.description || ''
                );

                return {
                    status: 200,
                    message: 'Trip added successfully',
                    id: id
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        isAdmin: async (token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const result = await context.findUser(user.login);
                if (result.length === 0) {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }

                return {
                    status: 200,
                    havePermission: result[0].is_admin
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getReservationsDriver: async (token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const result = await context.getReservationsDriver(user.id);
                return {
                    status: 200,
                    message: 'Reservations retrieved successfully',
                    reservations: result
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getReservationsPassenger: async (token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const result = await context.getReservationsPassenger(user.id);
                for (let i = 0; i < result.length; i++) {
                    const trip = await context.getTrip(result[i].trip_id);
                    const reservations = await context.getReservations(result[i].trip_id);
                    for (let j = 0; j < reservations.length; j++) {
                        if (reservations[j].status == 1 && reservations[j].user_id != user.id) {
                            result[i].remove = true;
                            break;
                        }
                    }
                }

                // filter out trips that are not available anymore
                const filtered = result.filter(r => !r.remove);

                return {
                    status: 200,
                    message: 'Reservations retrieved successfully',
                    reservations: filtered
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        addReservation: async (tripId, comment, token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const trip = await context.getTrip(tripId);
                if (trip.length === 0) {
                    return {
                        status: 404,
                        message: 'Trip not found'
                    };
                }

                const reservations = await context.getReservations(tripId);
                for (let i = 0; i < reservations.length; i++) {
                    if (reservations[i].status === 1) {
                        return {
                            status: 401,
                            message: 'This trip is already reserved by another user'
                        };
                    }
                }

                await context.addReservation(tripId, user.id, comment);
                return {
                    status: 200,
                    message: 'Reservation added successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        respondReservation: async (reservationId, response, comment, token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                const reservation = await context.getReservation(reservationId);
                if (reservation.length === 0) {
                    return {
                        status: 404,
                        message: 'Reservation not found'
                    };
                }

                const trip = await context.getTrip(reservation[0].trip_id);
                if (trip.length === 0) {
                    return {
                        status: 404,
                        message: 'Trip not found'
                    };
                }

                if (trip[0].driver_id !== user.id) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (reservation[0].status !== 0) {
                    return {
                        status: 401,
                        message: 'This reservation is already responded'
                    };
                }

                await context.respondReservation(reservationId, response, comment);
                return {
                    status: 200,
                    message: 'Reservation responded successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getAllRatings: async (token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (!isAdmin(user.id)) {
                    return {
                        status: 403,
                        message: 'No permission'
                    };
                }

                const result = await context.getAllRatings();
                return {
                    status: 200,
                    message: 'Ratings retrieved successfully',
                    ratings: result
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        deleteRating: async (token, id) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (!isAdmin(user.id)) {
                    return {
                        status: 403,
                        message: 'No permission'
                    };
                }

                const rating = await context.getRating(id);
                if (rating.length === 0) {
                    return {
                        status: 404,
                        message: 'Rating not found'
                    };
                }

                await context.deleteRating(id);
                return {
                    status: 200,
                    message: 'Rating deleted successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        getAllUsers: async (token) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (!isAdmin(user.id)) {
                    return {
                        status: 403,
                        message: 'No permission'
                    };
                }

                const result = await context.getAllUsers();
                return {
                    status: 200,
                    message: 'Users retrieved successfully',
                    users: result
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        deleteUser: async (token, id) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (!isAdmin(user.id)) {
                    return {
                        status: 403,
                        message: 'No permission'
                    };
                }

                if (user.id === id) {
                    return {
                        status: 401,
                        message: 'Cannot delete yourself'
                    };
                }

                const result = await context.findUserById(id);
                if (result.length === 0) {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }

                await context.deleteUser(id);
                return {
                    status: 200,
                    message: 'User deleted successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        },
        updateUser: async (token, id, data) => {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                if (!user) {
                    return {
                        status: 401,
                        message: 'Unauthorized'
                    };
                }

                if (data.is_admin === undefined || data.is_admin === null) {
                    return {
                        status: 400,
                        message: 'Missing is_admin field'
                    };
                }

                if (!isAdmin(user.id)) {
                    return {
                        status: 403,
                        message: 'No permission'
                    };
                }

                if (user.id === id) {
                    return {
                        status: 401,
                        message: 'Cannot edit yourself'
                    };
                }

                const result = await context.findUserById(id);
                if (result.length === 0) {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }

                await context.makeUserAdmin(id, data.is_admin);
                return {
                    status: 200,
                    message: 'Changed user admin status successfully'
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    message: 'Internal server error'
                };
            }
        }
    }
}