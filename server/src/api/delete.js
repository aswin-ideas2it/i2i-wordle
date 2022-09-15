const { gameModel } = require('./../models/game');
const { auditModel } = require('./../models/audit');

const deleteUser = async (req, res) => {
    try {
        const {
            userId
        } = req.body;

        await gameModel.findOneAndRemove({
            userId: userId
        });
        await auditModel.findOneAndRemove({
            userId: userId
        });
        res.send(true);
    } catch (error) {
        console.log(error, 'create');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    deleteUser
}
