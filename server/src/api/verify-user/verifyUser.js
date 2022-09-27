const { verifyModel } = require('../../models/verify-user');
const { userModel } = require('../../models/user');

const verifyUser = async (req, res) => {
    try {
        const {
            id,
            token
        } = req.body;
        const user = await userModel.findOne({ _id: id, userType: 'wordle' }, { userId: 1, userName: 1 });
        if (!user) res.send('UNF');
        const verifyDetails = await verifyModel.findOne({
            userId: user.userId,
            token,
        });
        if (!verifyDetails) return res.send('EXP');
        await userModel.findOneAndUpdate({
            userId: user.userId
        }, {
            $set: {
                isVerified: true
            }
        });
        await verifyDetails.delete();
        res.send(user);
    } catch (error) {
        console.log(error, 'getById');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    verifyUser
}
