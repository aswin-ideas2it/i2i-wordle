const { userModel } = require('./../../models/user');
const { generateHash } = require('./../../lib/encryption');

const create = async (req, res) => {
    try {
        const {
            userName
        } = req.body;
        const auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [userId, password] = Buffer.from(auth, 'base64').toString().split(':')

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
