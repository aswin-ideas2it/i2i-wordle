const { Schema, model, models } = require('mongoose');
const { historySchema } = require('./history');
const { logSchema } = require('./log');

const auditSchema = new Schema({
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
    history: {
        type: Map,
        of: historySchema,
        required: true,
    },
    log: [logSchema]
}, { collection: 'audit_details' });

const auditModel = models['audit_details'] || model('audit_details', auditSchema);

module.exports = {
    auditModel
}