const { userModel } = require('../models/user');
const { compareHash } = require('./encryption');

const getLoggedInDetails = async (userId, password) => {
    const userDetails = await userModel.findOne({
        userId
    })
    if (userDetails) {
        const isValid = await compareHash(password, userDetails.password);
        if (isValid) {
            await userModel.updateOne({
                userId
            }, {
                $set:
                {
                    LastLoggedIn: new Date().toISOString(),
                },
                $inc: {
                    LoggedInTimes: 1
                }
            });
            return userDetails;
        } else {
            return 'INP';
        }
    } else {
        return 'UNF';
    }
}

const loginGoogleUser = async (userId, userName, picture) => {
    const userDetails = await userModel.findOne({
        userId
    })
    if (userDetails) {
        await userModel.updateOne({
            userId
        }, {
            $set:
            {
                LastLoggedIn: new Date().toISOString(),
            },
            $inc: {
                LoggedInTimes: 1
            }
        });
        return userDetails;
    } else {
        const _userDetail = await userModel.create({
            userId,
            password: null,
            userName,
            userType: 'google',
            isVerified: true,
            createdAt: new Date().toISOString(),
            LastLoggedIn: null,
            dp: picture,
            LoggedInTimes: 0
        });
        return _userDetail;
    }
}

module.exports = {
    getLoggedInDetails,
    loginGoogleUser
}