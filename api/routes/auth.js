/*

POST /login - User authentication
    login - user login
    password - user password

POST /register - User registration
    login - user login
    password - user password
    name - user name

POST /change-name - User name change
    name - new user name
    [Requires authorization]

*/

module.exports = (database) => {
    const router = require('express').Router();

    router.post('/login', async (req, res) => {
        const login = req.body.login;
        const password = req.body.password;
        
        if (!login || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Login and password are required'
            });
        }

        const result = await database.login(login, password);
        res.status(result.status).json(result);
    });

    router.post('/register', async (req, res) => {
        const login = req.body.login;
        const password = req.body.password;
        const name = req.body.name;

        if (!login || !password || !name) {
            return res.status(400).json({
                status: 400,
                message: 'Name, login and password are required'
            });
        }

        const result = await database.register(login, password, name);
        res.status(result.status).json(result);
    });

    router.post('/change-name', async (req, res) => {
        const name = req.body.name;
        
        if (!req.token) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }

        if (!name) {
            return res.status(400).json({
                status: 400,
                message: 'Name is required'
            });
        }

        const result = await database.changeName(name, req.token);
        res.status(result.status).json(result);
    });

    return router;
}