const { gameModel } = require('../models/game');
const { auditModel } = require('./../models/audit');
const { decrypt } = require('../lib/encryption');
const { getAuditDetails, getGameHistory } = require('../lib/audit');
const { getFormattedToday } = require('../lib/date');

const update = async (req, res) => {
    try {
        const {
            userDetails,
            state: encryptedState,
            stats: encryptedStats

        } = req.body;

        const state = JSON.parse(decrypt(encryptedState));
        const stats = JSON.parse(decrypt(encryptedStats));

        await gameModel.findOneAndUpdate({ userId: userDetails.userId }, {
            $set:
            {
                lastModified: new Date(),
                state: {
                    guesses: state.guesses,
                    solution: state.solution,
                    gameWon: state.gameWon,
                    gameLost: state.gameLost
                },
                stats: {
                    winDistribution: stats.winDistribution,
                    gamesWon: stats.gamesWon,
                    gamesFailed: stats.gamesFailed,
                    currentStreak: stats.currentStreak,
                    bestStreak: stats.bestStreak,
                    totalGames: stats.totalGames,
                    successRate: stats.successRate
                }
            }
        });
        await auditModel.findOneAndUpdate({ userId: userDetails.userId }, {
            $set:
            {
                [`history.${getFormattedToday()}`]: getGameHistory(state)
            },
            $push: {
                log: getAuditDetails(req)
            }
        });
        res.send(true);
    } catch (error) {
        console.log(error, 'update');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    update
}
