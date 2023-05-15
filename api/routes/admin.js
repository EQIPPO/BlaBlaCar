/*

GET /perms - check if user is admin
    [Requires authentication]

GET /ratings - get all ratings
    [Requires authentication]

DELETE /ratings/:id - delete rating by id
    [Requires authentication]

GET /users - get all users
    [Requires authentication]

PATCH /users/:id - update user by id (only change is_admin)
    is_admin: boolean
    [Requires authentication]

DELETE /users/:id - delete user by id
    [Requires authentication]

GET /trips - get all trips
    [Requires authentication]

DELETE /trips/:id - delete trip by id
    [Requires authentication]

GET /reservations - get all reservations
    [Requires authentication]

DELETE /reservations/:id - delete reservation by id
    [Requires authentication]

*/

module.exports = (database) => {
    const router = require('express').Router();

    router.get('/perms', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.isAdmin(req.token);
        res.status(result.status).json(result);
    });

    router.get('/ratings', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getAllRatings(req.token);
        res.status(result.status).json(result);
    });

    router.delete('/ratings/:id', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.deleteRating(req.token, req.params.id);
        res.status(result.status).json(result);
    });

    router.get('/users', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getAllUsers(req.token);
        res.status(result.status).json(result);
    });

    router.patch('/users/:id', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.updateUser(req.token, req.params.id, req.body);
        res.status(result.status).json(result);
    });

    router.delete('/users/:id', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.deleteUser(req.token, req.params.id);
        res.status(result.status).json(result);
    });

    router.get('/trips', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getAllTrips(req.token);
        res.status(result.status).json(result);
    });

    router.delete('/trips/:id', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.deleteTrip(req.token, req.params.id);
        res.status(result.status).json(result);
    });

    router.get('/reservations', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getAllReservations(req.token);
        res.status(result.status).json(result);
    });

    router.delete('/reservations/:id', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.deleteReservation(req.token, req.params.id);
        res.status(result.status).json(result);
    });

    return router;
}