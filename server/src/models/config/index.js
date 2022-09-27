const { Schema, model, models } = require('mongoose');

const configSchema = new Schema({
    words: {
        type: [String],
        required: true,
        unique: true
    },
    guesses: {
        type: [String],
        required: true,
        unique: true
    }
}, { collection: 'config_details' });

const configModel = models['config_details'] || model('config_details', configSchema);

module.exports = {
    configModel
}