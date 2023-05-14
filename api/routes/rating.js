/*

GET /user/:user_id - Get user ratings

POST /user/:user_id - Add user rating
    rating - rating value (0-5)
    comment - rating comment
    [Requires authorization]

*/

module.exports = (database) => {
    const router = require('express').Router();

    router.get('/user/:user_id', async (req, res) => {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(400).json({
                status: 400,
                message: 'User id is required'
            });
        }

        const result = await database.getRatings(user_id);
        res.status(result.status).json(result);
    });

    router.post('/user/:user_id', async (req, res) => {
        const user_id = req.params.user_id;
        const rating = req.body.rating;
        const comment = req.body.comment;

        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        if (!user_id) {
            return res.status(400).json({
                status: 400,
                message: 'User id is required'
            });
        }

        if (!rating || isNaN(rating) || rating < 0 || rating > 5 || !comment) {
            return res.status(400).json({
                status: 400,
                message: 'Rating and comment are required'
            });
        }

        const result = await database.addRating(user_id, rating, comment, req.token);
        res.status(result.status).json(result);
    });

    return router;
}