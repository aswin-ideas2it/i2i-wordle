const { Schema } = require('mongoose');

const stateSchema = new Schema({
    guesses: {
        type: [String],
        required: true,
        unique: false
    },
    solution: {
        type: String,
        required: true,
        unique: false
    },
    gameWon: {
        type: Boolean,
        required: true,
        unique: false
    },
    gameLost: {
        type: Boolean,
        required: true,
        unique: false
    }
});

module.exports = {
    stateSchema
}