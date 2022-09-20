const { addDays,
    differenceInDays,
    startOfToday,
    startOfDay } = require('date-fns');
const { config: { gameDate: { month, year, date } } } = require('./../config');

const firstGameDate = new Date(year, month, date);
const periodInDays = 1;

const getToday = () => startOfToday();

const getLastGameDate = (today) => {
    const t = startOfDay(today)
    let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
    return addDays(t, -daysSinceLastGame)
}

const getNextGameDate = (today) => {
    return addDays(getLastGameDate(today), periodInDays)
}

const getFormattedDate = (gameDate) => {
    gameDate = new Date(gameDate);
    return `${gameDate.getDate()}-${gameDate.getMonth() + 1}-${gameDate.getFullYear()}`;
}

const getIndex = (gameDate) => {
    let start = firstGameDate
    let index = -1
    do {
        index++
        start = addDays(start, periodInDays)
    } while (start <= gameDate)

    return index
}

const getSolution = () => {
    const gameDate = getToday();
    const nextGameDate = getNextGameDate(gameDate)
    const index = getIndex(gameDate)
    return {
        index,
        tomorrow: nextGameDate.valueOf(),
        gameDate
    }
}

const getFormattedToday = () => {
    const gameDate = getToday();
    return getFormattedDate(gameDate);
}
module.exports = {
    getFormattedDate,
    getSolution,
    getFormattedToday
}
