const { Schema, model, models } = require('mongoose');

const verifySchema = new Schema({
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
}, { collection: 'verify_details' });

const verifyModel = models['verify_details'] || model('verify_details', verifySchema);

module.exports = {
    verifyModel
}
