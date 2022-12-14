const { configModel } = require('../models/config');
const { decrypt } = require('../lib/encryption');
const Joi = require('joi');

const checkGuesses = async (req, res) => {
    try {
        const { error } = Joi.object({
            guess: Joi.string().required()
        }).options({ allowUnknown: true }).validate(req.body);
        if (error) return res.status(400).send(error.message);

        const {
            guess
        } = req.body;
        let decryptedGuess = decrypt(guess);
        const config = await configModel.find(
            {
                '$or': [
                    {
                        'words': {
                            '$in': [
                                decryptedGuess
                            ]
                        }
                    }, {
                        'guesses': {
                            '$in': [
                                decryptedGuess
                            ]
                        }
                    }
                ]
            }
        );
        res.send(config.length ? true : false);
    } catch (error) {
        console.log(error, 'retreive');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    checkGuesses
}
