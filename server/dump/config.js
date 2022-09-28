const { join } = require('path');
require('dotenv').config({ path: join(__dirname, './../.env') });

const mongoose = require('mongoose');
const { configModel } = require('../src/models/config');
const words = require('./words.json');
const guesses = require('./guesses.json');

const MONGO_URL = process.env.MONGO_URI;

const connectMongo = async () => mongoose.connect(MONGO_URL);

connectMongo().then(() => {
    console.log(`Mongo DB Connected`);
    configModel.create({
        words,
        guesses
    }).then(() => {
        console.log('created');
        process.exit(0);
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    })
});