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

    return router;
}