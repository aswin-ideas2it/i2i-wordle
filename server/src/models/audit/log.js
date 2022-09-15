const { Schema } = require('mongoose');

const logSchema = new Schema({
    browser: {
        type: String,
        required: true,
        unique: false
    },
    browserVersion: {
        type: String,
        required: true,
        unique: false
    },
    os: {
        type: String,
        required: true,
        unique: false
    },
    ip: {
        type: String,
        required: true,
        unique: false
    },
    isMobile: {
        type: String,
        required: true,
        unique: false
    },
    ua: {
        type: String,
        required: true,
        unique: false
    },
    date: {
        type: Date,
        required: true,
        unique: false
    },
});

module.exports = {
    logSchema
}