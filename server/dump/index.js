const mongoose = require('mongoose');
const { configModel } = require('./../src/models/config');
const MONGO_URL = 'mongodb://localhost:27017/wordle-app';
const words = require('./words.json');
const guesses = require('./guesses.json');

const connectMongo = async () => mongoose.connect(MONGO_URL);

connectMongo().then(() => {
    console.log(`Mongo DB Connected`);
    configModel.create({
        words,
        guesses
    }).then(() => {
        console.log('created');
    }).catch((err) => {
        console.log(err);
    })
});