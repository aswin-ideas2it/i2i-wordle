const { gameModel } = require('./../models/game');
const { configModel } = require('./../models/config');
const { encrypt } = require('./../lib/encryption');
const { getSolution, getFormattedDate } = require('./../lib/date');

const retreive = async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        const _sol = getSolution();
        const solutionIndex = _sol.index;
        let gameData = undefined;
        let game = await gameModel.find({
            userId: userId
        }, { _id: 0, "stats._id": 0, "state._id": 0 });
        if (game.length) {
            gameData = {};
            gameData.stats = encrypt(JSON.stringify(game[0].stats));
            gameData.state = encrypt(JSON.stringify(game[0].state));
            gameData.userId = game[0].userId;
            gameData.isLocalUser = game[0].isLocalUser;
        }
        const config = await configModel.find({}, { words: 1 });
        if (!config.length) res.status(400).send('Config is missing');
        const solution = config[0].words[solutionIndex] ? config[0].words[solutionIndex] :
            config[0].words[config[0].words.length - 1];
        res.json({ gameData, _res: encrypt(solution), index: solutionIndex, tomorrow: _sol.tomorrow, gameDate: getFormattedDate(_sol.gameDate) });
    } catch (error) {
        console.log(error, 'retreive');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    retreive
}
