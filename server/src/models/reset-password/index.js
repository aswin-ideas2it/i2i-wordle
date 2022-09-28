const { Schema, model, models } = require('mongoose');

const resetSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 259200
    }
}, { collection: 'reset_details' });

const resetModel = models['reset_details'] || model('reset_details', resetSchema);

module.exports = {
    resetModel
}
