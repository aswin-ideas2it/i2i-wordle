const { gameModel } = require('./../models/game');
const { userModel } = require('./../models/user');
const { auditModel } = require('./../models/audit');

const deleteUser = async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        await userModel.findOneAndRemove({
            userId: userId
        });
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
