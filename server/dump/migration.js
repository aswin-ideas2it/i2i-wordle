const { join } = require('path');
require('dotenv').config({ path: join(__dirname, './../.env') });

const mongoose = require('mongoose');
const { sendPostRequest, sendGetRequest } = require('./../src/lib/http');
const { gameModel } = require('./../src/models/game');
const { auditModel } = require('./../src/models/audit');
const { userModel } = require('./../src/models/user');

const MONGO_URL = process.env.MONGO_URI;

const connectMongo = async () => mongoose.connect(MONGO_URL);

const migrateUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let game = await gameModel.find({}, { _id: 0, stats: 0, state: 0, lastModified: 0 });
            console.log('Total User - ' + game.length);
            const accessDetails = await getAccessToken();
            for (let i = 0; i < game.length; i++) {
                const { userId, isLocalUser } = game[i];
                console.log(`******Migrating User ${userId} (count - ${i + 1}, rem - ${game.length - (i + 1)})******`);
                let name = null;
                let email = userId;
                let createdAt = null;
                let picture = null;
                let isVerified = false;
                let loginCount = 0;
                let password = null;
                let lastLogin = null;
                let userType = 'local';
                if (!isLocalUser) {
                    const profile = await getAuth0UserDetail(userId, accessDetails.access_token);
                    name = profile.name;
                    email = profile.email;
                    isVerified = true;
                    createdAt = profile.created_at;
                    picture = profile.picture;
                    loginCount = profile.logins_count;
                    lastLogin = profile.last_login;
                    userType = userId.includes('auth0') ? 'wordle' : 'google';
                    password = userId.includes('auth0') ? '$2b$05$lPlT7bHtVhXoZEUdOhdYpOEwBPHcSUPOOyrpl5Rga3QWPCcTyeijy' : null
                }
                await createUser(email, name, password, isVerified, userType, createdAt, lastLogin, picture, loginCount);
                console.log('User Created');
                await updateUserDetails(userId, email);
                console.log('User Updated');
                console.log(`******Migrated User ${userId} (count - ${i + 1}, rem - ${game.length - (i + 1)})******`);
            }
            resolve(game.length);
        } catch (err) {
            reject(err);
        }
    })
}

const createUser = async (userId, userName, password, isVerified, userType, createdAt, LastLoggedIn, dp, LoggedInTimes) => {
    await userModel.create({
        userId,
        password,
        isVerified,
        userName,
        userType,
        createdAt,
        LastLoggedIn,
        dp,
        LoggedInTimes
    });
}

const updateUserDetails = async (userId, newUserId) => {
    await gameModel.findOneAndUpdate({
        userId: userId
    }, {
        $set: {
            userId: newUserId
        }
    });
    await auditModel.findOneAndUpdate({
        userId: userId
    }, {
        $set: {
            userId: newUserId
        }
    });
}

const getAccessToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://ps-ideas2it.us.auth0.com/oauth/token`;
            const payload = {
                'audience': 'https://ps-ideas2it.us.auth0.com/api/v2/',
                'grant_type': 'client_credentials',
                'client_id': process.env.AUTH0_CLIENT_ID,
                'client_secret': process.env.AUTH0_CLIENT_SECRET
            }
            const response = await sendPostRequest(url, payload);
            resolve(response);
        }
        catch (err) {
            reject(err);
        }
    });
}

const getAuth0UserDetail = (userId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://ps-ideas2it.us.auth0.com/api/v2/users/${userId}`;
            const header = {
                Authorization: `Bearer ${token}`
            };
            const response = await sendGetRequest(url, {}, header);
            resolve(response);
        }
        catch (err) {
            reject(err);
        }
    });
}

connectMongo().then(() => {
    console.log(`Mongo DB Connected`);
    migrateUsers().then((length) => {
        console.log(`Migrated ${length} users successfully`);
        process.exit(0);
    }).catch((err) => {
        console.log(err);
        console.log('Migration failed');
        process.exit(1);
    })
});