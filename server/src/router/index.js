const express = require('express');
const router = express.Router();
const { retreive } = require('./../api/retreive');
const { create } = require('./../api/create');
const { update } = require('./../api/update');
const { updateState } = require('./../api/updateState');
const { updateStats } = require('./../api/updateStats');
const { deleteUser } = require('./../api/delete');
const { checkGuesses } = require('./../api/guesses');
const { gameDate } = require('./../api/filter/gameDate');
const { create: userCreate } = require('./../api/user/create');
const { generate: generateResetLink } = require('./../api/reset-password/generate');
const { reset: resetPassword } = require('./../api/reset-password/reset');
const { getUser: resetGetUser } = require('./../api/reset-password/getUser');
const { verifyUser } = require('./../api/verify-user/verifyUser');
const { getUser: verifyGetUser } = require('./../api/verify-user/getUser');
const { generate: generateVerificationLink } = require('./../api/verify-user/generate');
const authRouter = require('./auth');

router.get('/health', (req, res) => res.send('Good!'));

router.post('/retreive', retreive);
router.post('/create', create);
router.post('/updateState', updateState);
router.post('/updateStats', updateStats);
router.post('/update', update);
router.post('/delete', deleteUser);
router.post('/checkGuesses', checkGuesses);

// User Creation 
router.post('/user/create', userCreate);

router.post('/reset/sendLink', generateResetLink);
router.post('/reset/changePassword', resetPassword);
router.post('/reset/getUser', resetGetUser);

router.post('/verify/verifyUser', verifyUser);
router.post('/verify/sendLink', generateVerificationLink);
router.post('/verify/getUser', verifyGetUser);

// Filter
router.post('/filter/gameDate', gameDate);

// Auth
router.use('/auth', authRouter);

module.exports = router;
