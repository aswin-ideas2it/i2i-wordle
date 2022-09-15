const mongoose = require('mongoose');
const { Schema, model, models } = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/wordle-app';
const words = require('./words.json');
const guesses = require('./guesses.json');

const collectionName = 'config_details';

const configSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    words: {
        type: [String],
        required: true,
        unique: false
    },
    guesses: {
        type: [String],
        required: true,
        unique: false
    }
}, { collection: collectionName });

const configModel = models[collectionName] || model(collectionName, configSchema);

const connectMongo = async () => mongoose.connect(MONGO_URL);

connectMongo().then(() => {
    console.log(`Mongo DB Connected`);
    configModel.create({
        _id: 'config',
        words,
        guesses
    }).then(() => {
        console.log('created');
    }).catch((err) => {
        console.log(err);
    })
});