const { resetModel } = require('./../../models/reset-password');
const { userModel } = require('./../../models/user');
const crypto = require('crypto');
const { sendEmail } = require('./../../lib/mail');
const { config: { clientUrl } } = require('./../../config');
const { readFileSync } = require('fs');
const Joi = require('joi');

const generate = async (req, res) => {
    try {
        const { error } = Joi.object({
            userId: Joi.string().pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            userId
        } = req.body;

        const user = await userModel.findOne({ userId, userType: 'wordle' });

        if (!user) return res.send('UNF');

        await resetModel.deleteOne({ userId: userId });

        const token = crypto.randomBytes(32).toString("hex");

        await resetModel.create({
            userId,
            token,
        });

        const link = `${clientUrl}/password-reset/${user._id}/${token}`;
        const template = readFileSync('server/template/reset.html', { encoding: 'utf-8' });
        await sendEmail(userId, "Ideas2IT சொல்லாடல் - Password Reset", template.replace(/{{link}}/, link));
        res.send(true);
    } catch (error) {
        console.log(error, 'generate');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    generate
}
