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

    return router;
}