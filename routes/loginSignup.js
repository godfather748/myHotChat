const route = require('express').Router();
const {
    users
} = require('../db/models.js');


route.get('/', (req, res) => {
    res.render('login');
});


route.get('/signup', (req, res) => {
    res.render('signup');
});

let onlineUsers = []

route.post('/', async (req, res) => {
    try {
        const user = await users.findOne({
            where: {
                username: req.body.username
            }
        });
        if (!user) {
            return res.render('login', {
                error: `Username doesn't exist!!`
            });
        };
        if (user.password != req.body.password) {
            return res.render('login', {
                error: `Incorrect password!!`
            });
        };
        onlineUsers.push(req.body.username)
        res.redirect('/chatpage');
    } catch (err) {
        console.error(new Error('cannot login'))
        console.error(err)
    }
})


route.post('/signup', async (req, res) => {
    try {
        const user1 = await users.findOne({
            where: {
                username: req.body.username
            }
        });
        if (user1) {
            return res.render('signup', {
                error: `Username already exists!!`
            });
        };
        const user2 = await users.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user2) {
            return res.render('signup', {
                error: `User with this email already exists!!`
            });
        };
        await users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        res.redirect('/');
    } catch (err) {
        console.error(new Error(`cannot signup`));
        console.error(err);
    };
});


module.exports = {
    route,
    onlineUsers
};