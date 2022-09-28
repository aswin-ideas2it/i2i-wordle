const { gameModel } = require('../models/game');
const { auditModel } = require('./../models/audit');
const { decrypt } = require('../lib/encryption');
const { getAuditDetails } = require('../lib/audit');
const Joi = require('joi');

const updateStats = async (req, res) => {
    try {
        const { error } = Joi.object({
            userDetails: Joi.object({
                userId: Joi.string().required(),
                isLocalUser: Joi.boolean().required(),
            }).required(),
            stats: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            userDetails,
            stats: encryptedStats
        } = req.body;

        const stats = JSON.parse(decrypt(encryptedStats));

        await gameModel.findOneAndUpdate({ userId: userDetails.userId }, {
            $set:
            {
                lastModified: new Date().toISOString(),
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
            $push: {
                log: getAuditDetails(req)
            }
        });
        res.send(true);
    } catch (error) {
        console.log(error, 'retreive');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    updateStats
}
