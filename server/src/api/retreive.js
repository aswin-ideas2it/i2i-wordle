const { gameModel } = require('./../models/game');
const { userModel } = require('./../models/user');
const { configModel } = require('./../models/config');
const { encrypt } = require('./../lib/encryption');
const { getSolution, getFormattedToday } = require('./../lib/date');
const Joi = require('joi');

const retreive = async (req, res) => {
    try {
        const { error } = Joi.object({
            userId: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            userId
        } = req.body;
        const _sol = getSolution();
        const solutionIndex = _sol.index;
        let gameData = undefined;
        let userDetails = undefined;
        let game = await gameModel.find({
            userId: userId
        }, { _id: 0, "stats._id": 0, "state._id": 0 });
        if (game.length) {
            gameData = {};
            gameData.stats = encrypt(JSON.stringify(game[0].stats));
            gameData.state = encrypt(JSON.stringify(game[0].state));
            gameData.userId = game[0].userId;
            gameData.isLocalUser = game[0].isLocalUser;

            userDetails = await userModel.findOne({ userId }, { userId: 1, _id: 1, isVerified: 1, dp: 1 });
        }
        const config = await configModel.find({}, { words: 1 });
        if (!config.length) res.status(400).send('Config is missing');
        const solution = config[0].words[solutionIndex] ? config[0].words[solutionIndex] :
            config[0].words[config[0].words.length - 1];
        res.json({ gameData, _res: encrypt(solution), index: solutionIndex, tomorrow: _sol.tomorrow, gameDate: getFormattedToday(), userDetails });
    } catch (error) {
        console.log(error, 'retreive');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    retreive
}
