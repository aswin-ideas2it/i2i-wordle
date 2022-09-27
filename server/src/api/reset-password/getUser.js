const { resetModel } = require('../../models/reset-password');
const { userModel } = require('../../models/user');

const getUser = async (req, res) => {
    try {
        const {
            id,
            token
        } = req.body;
        const user = await userModel.findOne({ _id: id, userType: 'wordle' }, { userId: 1, userName: 1 });
        if (!user) res.send('UNF');
        const resetDetails = await resetModel.findOne({
            userId: user.userId,
            token,
        });
        if (!resetDetails) return res.send('EXP');
        res.send(user);
    } catch (error) {
        console.log(error, 'getById');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    getUser
}
