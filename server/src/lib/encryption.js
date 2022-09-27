const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const { config: { encryption } } = require('./../config');

const key = CryptoJS.enc.Base64.parse(encryption.key);
const iv = CryptoJS.enc.Base64.parse(encryption.iv);

const encrypt = (data) => {
    return CryptoJS.AES.encrypt(data, key, { iv: iv }).toString();;
}

const decrypt = (encoded) => {
    const bytes = CryptoJS.AES.decrypt(encoded, key, { iv: iv });
    return bytes.toString(CryptoJS.enc.Utf8);
}

const generateHash = (pwd) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pwd, encryption.salt).then((hash) => {
            resolve(hash);
        }).catch(((err) => {
            reject(err);
        }))
    });
}

const compareHash = (pwd, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pwd, hash).then((result) => {
            resolve(result);
        }).catch(((err) => {
            reject(err);
        }))
    });
}

module.exports = {
    encrypt,
    decrypt,
    generateHash,
    compareHash
}