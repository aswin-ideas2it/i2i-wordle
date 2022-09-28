const { userModel } = require('./../../models/user');
const { generateHash } = require('./../../lib/encryption');
const Joi = require('joi');

const create = async (req, res) => {
    try {
        const auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [userId, password] = Buffer.from(auth, 'base64').toString().split(':');

        const { error } = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().min(6).required(),
            userId: Joi.string().pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required()
        }).options({ allowUnknown: true }).validate({ ...req.body, userId, password });
        if (error) return res.status(400).send(error.message);

        const {
            userName
        } = req.body;

        const userDetails = await userModel.findOne({
            userId
        })
        if (!userDetails) {
            const hashedPwd = await generateHash(password);
            await userModel.create({
                userId,
                password: hashedPwd,
                createdAt: new Date().toISOString(),
                dp: null,
                LastLoggedIn: null,
                isVerified: false,
                userName,
                userType: 'wordle',
                LoggedInTimes: 0
            });
            res.send(true);
        } else {
            res.send('UAE');
        }
    } catch (error) {
        console.log(error, 'create');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    create
}
