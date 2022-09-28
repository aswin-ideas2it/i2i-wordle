const { userModel } = require('../../models/user');
const Joi = require('joi');

const getUser = async (req, res) => {
    try {
        const { error } = Joi.object({
            id: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            id,
        } = req.body;
        const user = await userModel.findOne({ _id: id, userType: 'wordle' }, { userId: 1, userName: 1 });
        if (!user) res.send('UNF');
        res.send(user);
    } catch (error) {
        console.log(error, 'getUser');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    getUser
}
