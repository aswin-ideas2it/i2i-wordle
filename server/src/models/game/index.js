const { Schema, model, models } = require('mongoose');
const { stateSchema } = require('./state');
const { statsSchema } = require('./stats');

const gameSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    isLocalUser: {
        type: Boolean,
        required: true,
        unique: false
    },
    lastModified: {
        type: Date,
        required: true,
        unique: false
    },
    state: stateSchema,
    stats: statsSchema,
}, { collection: 'game_details' });

const gameModel = models['game_details'] || model('game_details', gameSchema);

module.exports = {
    gameModel
}