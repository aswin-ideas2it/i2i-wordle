const { config: { gameStatus } } = require('./../config');

const resoveGameStatus = (state) => {
    if (state.gameWon) {
        return gameStatus.won
    } else if (state.gameLost) {
        return gameStatus.lost
    } else {
        return gameStatus.inProgress
    }
}

const getAuditDetails = (req) => {
    const userAgent = req.useragent;

    return {
        browser: userAgent.browser,
        browserVersion: userAgent.version,
        os: userAgent.os,
        ip: req.clientIp,
        ua: userAgent.source,
        isMobile: userAgent.isMobile,
        date: new Date().toISOString()
    }
}

const getGameHistory = (state) => {
    const gameStatus = resoveGameStatus(state);
    return {
        guesses: state.guesses.length,
        status: gameStatus,
        date: new Date().toISOString()
    }
}

module.exports = {
    getAuditDetails,
    getGameHistory
}
