const { userModel } = require('../../models/user');

const getUser = async (req, res) => {
    try {
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
