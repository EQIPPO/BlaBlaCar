module.exports = (database) => {
    const router = require('express').Router();

    // Token verification middleware
    router.use((req, res, next) => {
        if (req.headers.authorization) {
            const split = req.headers.authorization.split(' ');
            if (split.length === 2 && split[0] === 'Bearer') {
                const token = split[1];
                req.token = token;
            }
        }
        next();
    });

    // Routes
    router.use('/auth', require('./routes/auth')(database));
    router.use('/rating', require('./routes/rating')(database));
    router.use('/reservations', require('./routes/reservations')(database));
    router.use('/trips', require('./routes/trips')(database));
    router.use('/admin', require('./routes/admin')(database));

    // 404 handler
    router.use((req, res) => {
        res.status(404).json({
            status: 404,
            message: 'Method not found'
        });
    });

    return router;
};