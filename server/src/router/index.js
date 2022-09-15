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

router.get('/health', (req, res) => res.send('Good!'));
router.post('/retreive', retreive);
router.post('/create', create);
router.post('/updateState', updateState);
router.post('/updateStats', updateStats);
router.post('/update', update);
router.post('/delete', deleteUser);
router.post('/checkGuesses', checkGuesses);

router.post('/filter/gameDate', gameDate);

module.exports = router;
