module.exports = (connection_string) => {
    console.log('📅 Connecting to SQLite database...')
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(connection_string);

    // Create tables if they don't exist
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            login TEXT NOT NULL,
            password TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_id INTEGER NOT NULL,
            start TEXT NOT NULL,
            end TEXT NOT NULL,
            time DATETIME NOT NULL,
            passengers INTEGER NOT NULL,
            description TEXT NOT NULL,
            FOREIGN KEY (driver_id) REFERENCES users (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            comment TEXT NOT NULL,
            response TEXT,
            response_time DATETIME,
            status INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            creator_id INTEGER NOT NULL,
            comment TEXT NOT NULL,
            rating INTEGER NOT NULL,
            time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (creator_id) REFERENCES users (id)
        )`);
    });

    return {
        findUser: async (username) => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM users WHERE login = ?`, [username], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        },
        createUser: async (username, password, name) => {
            return new Promise((resolve, reject) => {
                db.run(`INSERT INTO users (login, password, name) VALUES (?, ?, ?)`, [username, password, name], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(this.lastID);
                });
            });
        },
        changeName: async (user_id, name) => {
            return new Promise((resolve, reject) => {
                db.run(`UPDATE users SET name = ? WHERE id = ?`, [name, user_id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        },
        getRatings: async (user_id) => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ratings WHERE user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        },
        addRating: async (user_id, creator_id, rating, comment) => {
            return new Promise((resolve, reject) => {
                db.run(`INSERT INTO ratings (user_id, creator_id, comment, rating) VALUES (?, ?, ?, ?)`, [user_id, creator_id, comment, rating], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        },
        getTrips: async (options) => {
            return new Promise((resolve, reject) => {
                let query = `SELECT * FROM trips WHERE 1 = 1`;
                let params = [];
                if (options) {
                    if (options.driver_id) {
                        query += ` AND driver_id = ?`;
                        params.push(options.driver_id);
                    }
                    if (options.start) {
                        query += ` AND start = ?`;
                        params.push(options.start);
                    }
                    if (options.end) {
                        query += ` AND end = ?`;
                        params.push(options.end);
                    }
                    if (options.time) {
                        query += ` AND time <= ?`;
                        params.push(options.time);
                    }
                    if (options.passengers) {
                        query += ` AND passengers >= ?`;
                        params.push(options.passengers);
                    }
                }
                db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        },
        getTrip: async (trip_id) => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM trips WHERE id = ?`, [trip_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        },
        createTrip: async (driver_id, start, end, time, passengers, description) => {
            return new Promise((resolve, reject) => {
                db.run(`INSERT INTO trips (driver_id, start, end, time, passengers, description) VALUES (?, ?, ?, ?, ?, ?)`, [driver_id, start, end, time, passengers, description], function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(this.lastID);
                });
            });
        },
        getReservations: async (trip_id) => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM reservations WHERE trip_id = ?`, [trip_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        }
    }
}