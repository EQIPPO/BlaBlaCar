/*

GET / - Get all trips (with optional filters)
    driver_id - driver id
    start - start location
    end - end location
    time - time (in unix timestamp)
    passengers - minimum number of passengers

GET /hints - Get location hints
    q - query

GET /:id - Get trip by id

POST / - Create a trip
    start - start location
    end - end location
    time - time (in unix timestamp)
    passengers - minimum number of passengers
    description - description
    [Requires authentication]

*/

const nominatim = require('nominatim-client');
const client = nominatim.createClient({
    useragent: "BlaBlaCar",
    referer: 'https://blablacar.prevter.ml',
});

module.exports = (database) => {
    const router = require('express').Router();

    router.get('/', async (req, res) => {
        const result = await database.getTrips(req.query, req.token);
        res.status(result.status).json(result);
    });

    router.get('/hints', async (req, res) => {
        const options = {
            q: req.query.q,
            addressdetails: 1,
            limit: 10,
        };

        const results = await client.search(options);
        res.status(200).json({
            status: 200,
            hints: results.map((result) => result.display_name)
        });
    });

    router.get('/:id', async (req, res) => {
        const result = await database.getTrip(req.params.id, req.token);
        res.status(result.status).json(result);
    });

    router.post('/', async (req, res) => {
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        if (!req.body.start || !req.body.end || !req.body.time || !req.body.passengers) {
            return res.status(400).json({
                status: 400,
                message: 'Start, end, time and passengers are required'
            });
        }
        
        const result = await database.addTrip(req.body, req.token);
        res.status(result.status).json(result);
    });

    return router;
}