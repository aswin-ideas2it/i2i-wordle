const { resetModel } = require('./../../models/reset-password');
const { generateHash } = require('./../../lib/encryption');
const { userModel } = require('./../../models/user');
const Joi = require('joi');

const reset = async (req, res) => {
    try {
        const { error } = Joi.object({
            token: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            token
        } = req.body;

        const auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [userId, password] = Buffer.from(auth, 'base64').toString().split(':')

        const resetDetails = await resetModel.findOne({
            userId: userId,
            token: token,
        });
        if (!resetDetails) return res.send('EXP');
        const hashedPwd = await generateHash(password);
        await userModel.findOneAndUpdate({
            userId
        }, {
            $set: {
                password: hashedPwd
            }
        });
        await resetDetails.delete();
        res.send(true);
    } catch (error) {
        console.log(error, 'reset');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    reset
}
