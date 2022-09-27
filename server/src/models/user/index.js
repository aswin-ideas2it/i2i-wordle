const { Schema, model, models } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        required: true,
        unique: false
    },
    userName: {
        type: String,
        required: false,
        unique: false
    },
    isVerified: {
        type: Boolean,
        required: false,
        unique: false
    },
    password: {
        type: String,
        required: false,
        unique: false
    },
    LastLoggedIn: {
        type: Date,
        required: false,
        unique: false
    },
    dp: {
        type: String,
        required: false,
        unique: false
    },
    createdAt: {
        type: Date,
        required: false,
        unique: false
    },
    LoggedInTimes: {
        type: Number,
        required: false,
        unique: false
    }
}, { collection: 'user_details' });

const userModel = models['user_details'] || model('user_details', userSchema);

module.exports = {
    userModel
}