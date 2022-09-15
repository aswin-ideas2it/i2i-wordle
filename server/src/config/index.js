const config = {
    encryption: {
        key: process.env.ENCRYPTION_KEY,
        iv: process.env.ENCRYPTION_IV
    },
    gameStatus: {
        won: 1,
        lost: -1,
        inProgress: 2
    }
}

module.exports = {
    config
};
