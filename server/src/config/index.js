const config = {
    encryption: {
        key: process.env.ENCRYPTION_KEY,
        iv: process.env.ENCRYPTION_IV
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
    }
}

module.exports = {
    config
};
