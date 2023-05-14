/*

GET /driver - get all reservations user has got (driver)
    [Requires authentication]

GET /passenger - get all reservations user has sent (passenger)
    [Requires authentication]

POST / - create a new reservation
    tripId - id of the trip
    comment - comment for the driver
    [Requires authentication]

POST /respond/:id - respond to a reservation
    id - id of the reservation
    response - response to the reservation (true/false)
    comment - comment for the passenger
    [Requires authentication]
*/

module.exports = (database) => {
    const router = require('express').Router();

    router.get('/driver', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getReservationsDriver(req.token);
        res.status(result.status).json(result);
    });

    router.get('/passenger', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        const result = await database.getReservationsPassenger(req.token);
        res.status(result.status).json(result);
    });

    router.post('/', async (req, res) => {
        const tripId = req.body.tripId;
        const comment = req.body.comment;

        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        if (!tripId || !comment) {
            return res.status(400).json({
                status: 400,
                message: 'Trip id and comment are required'
            });
        }

        const result = await database.addReservation(tripId, comment, req.token);
        res.status(result.status).json(result);
    });

    router.post('/respond/:id', async (req, res) => {
        const id = req.params.id;
        const response = req.body.response;
        const comment = req.body.comment;

        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        if (!id || !response || !comment) {
            return res.status(400).json({
                status: 400,
                message: 'Id, response and comment are required'
            });
        }

        const result = await database.respondReservation(id, response, comment, req.token);
        res.status(result.status).json(result);
    });

    return router;
}