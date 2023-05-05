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
                const result = await context.getRatings(user_id);
                let sum = 0;
                for (let i = 0; i < result.length; i++) {
                    sum += result[i].rating;
                }
                const average = sum / result.length;
                return {
                    status: 200,
                    message: 'Ratings retrieved successfully',
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
                const reservations = result.map(async (trip) => {
                    return await context.getReservations(trip.id);
                });

                // if it's already reserved, check if it's reserved by the user
                let filtered = [];
                for (let i = 0; i < reservations.length; i++) {
                    if (reservations[i].length !== 0 && reservations[i][0].status !== 1) {
                        if (token) {
                            const user = jwt.verify(token, process.env.SECRET_KEY);
                            if (user && user.id === reservations[i][0].user_id) {
                                result[i].reserved = true;
                                filtered.push(result[i]);
                            }
                        }
                    }
                    else {
                        filtered.push(result[i]);
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

                // check it's reservations
                const reservations = await context.getReservations(id);
                
                // if it's already reserved, check if it's reserved by the user
                if (reservations.length !== 0 && reservations[0].status !== 1) {
                    if (token) {
                        const user = jwt.verify(token, process.env.SECRET_KEY);
                        if (!user) {
                            return {
                                status: 401,
                                message: 'Unauthorized'
                            };
                        }

                        if (reservations[0].user_id !== user.id) {
                            return {
                                status: 401,
                                message: 'This trip is already reserved'
                            };
                        }

                        reservations[0].reserved = true;
                    }
                    else {
                        return {
                            status: 401,
                            message: 'This trip is already reserved'
                        };
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
        }
    }
}