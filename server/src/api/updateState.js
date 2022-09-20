const { gameModel } = require('../models/game');
const { auditModel } = require('../models/audit');
const { decrypt } = require('../lib/encryption');
const { getAuditDetails, getGameHistory } = require('../lib/audit');
const { getFormattedToday } = require('../lib/date');

const updateState = async (req, res) => {
    try {
        const {
            userDetails,
            state: encryptedState

        } = req.body;

        const state = JSON.parse(decrypt(encryptedState));

        await gameModel.findOneAndUpdate({ userId: userDetails.userId }, {
            $set:
            {
                lastModified: new Date().toISOString(),
                state: {
                    guesses: state.guesses,
                    solution: state.solution,
                    gameWon: state.gameWon,
                    gameLost: state.gameLost
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
        console.log(error, 'updateState');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    updateState
}
