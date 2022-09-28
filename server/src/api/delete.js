const { gameModel } = require('./../models/game');
const { userModel } = require('./../models/user');
const { auditModel } = require('./../models/audit');
const Joi = require('joi');

const deleteUser = async (req, res) => {
    try {
        const { error } = Joi.object({
            userId: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

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
