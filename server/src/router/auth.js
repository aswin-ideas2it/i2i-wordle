const express = require('express');
const router = express.Router();
const { login } = require('./../api/user/login');
const { config: { clientUrl } } = require('./../config');
const passport = require('passport');

router.post('/login', login);

router.post('/logout', (req, res) => {
    req.logout(function (err) {
        res.send(true);
    });
});

router.post('/checkAuthStatus', (req, res) => res.send({ isAuthenticated: req.isAuthenticated(), user: req.user }))

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${clientUrl}/login` }),
    (req, res) => {
        res.redirect(clientUrl);
    });

module.exports = router;
