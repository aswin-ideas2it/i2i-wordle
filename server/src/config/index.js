const config = {
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,
    encryption: {
        key: process.env.ENCRYPTION_KEY,
        iv: process.env.ENCRYPTION_IV,
        salt: parseInt(process.env.SALT_ROUND)
    },
    gameDate: {
        date: 19,
        month: 9,
        year: 2022
    },
    gameStatus: {
        won: 1,
        lost: -1,
        inProgress: 2
    },
    mail: {
        host: 'smtp.gmail.com',
        service: 'gmail',
        user: process.env.MAIL_USER,
        pwd: process.env.MAIL_PASS
    }
}

module.exports = {
    config
};
