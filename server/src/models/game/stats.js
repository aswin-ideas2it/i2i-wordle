const { Schema } = require('mongoose')

const statsSchema = new Schema({
    winDistribution: {
        type: [Number],
        required: true,
        unique: false
    },
    gamesWon: {
        type: Number,
        required: true,
        unique: false
    },
    gamesFailed: {
        type: Number,
        required: true,
        unique: false
    },
    currentStreak: {
        type: Number,
        required: true,
        unique: false
    },
    bestStreak: {
        type: Number,
        required: true,
        unique: false
    },
    totalGames: {
        type: Number,
        required: true,
        unique: false
    },
    successRate: {
        type: Number,
        required: true,
        unique: false
    }
});

module.exports = {
    statsSchema
}