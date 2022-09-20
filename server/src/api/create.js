const { gameModel } = require('./../models/game');
const { auditModel } = require('./../models/audit');
const { decrypt } = require('./../lib/encryption');
const { getAuditDetails, getGameHistory } = require('./../lib/audit');
const { getFormattedToday } = require('../lib/date');

const create = async (req, res) => {
    try {
        const {
            userDetails,
            state: encryptedState,
            stats: encryptedStats
        } = req.body;

        const state = JSON.parse(decrypt(encryptedState));
        const stats = JSON.parse(decrypt(encryptedStats));

        await gameModel.create({
            userId: userDetails.userId,
            isLocalUser: userDetails.isLocalUser,
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
        });
        await auditModel.create({
            userId: userDetails.userId,
            isLocalUser: userDetails.isLocalUser,
            [`history.${getFormattedToday()}`]: getGameHistory(state),
            log: [getAuditDetails(req)]
        });
        res.send(true);
    } catch (error) {
        console.log(error, 'create');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    create
}
