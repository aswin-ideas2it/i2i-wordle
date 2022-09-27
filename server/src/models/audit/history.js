const { Schema } = require('mongoose');

const historySchema = new Schema({
    status: {
        type: Number,
        required: true,
        unique: false
    },
    guesses: {
        type: Number,
        required: true,
        unique: false
    },
    date: {
        type: Date,
        required: true,
        unique: false
    }
});

module.exports = {
    historySchema
}