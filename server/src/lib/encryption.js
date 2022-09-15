const CryptoJS = require("crypto-js");

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

module.exports = {
    encrypt,
    decrypt
}