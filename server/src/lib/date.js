const { addDays,
    differenceInDays,
} = require('date-fns');
const { config: { gameDate: { month, year, date } } } = require('./../config');

const parseDate = (date) => {
    return date.toISOString().split("T")[0].split('-');
}

const getISTDate = (dateUTC) => {
    const dateIST = new Date(dateUTC);
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST;
}

const getInitialDate = (year, month, date) => {
    month = month.toString().length === 1 ? '0' + month : month;
    return new Date(`${year}-${month}-${date}T00:00:00.000Z`);
}

const firstGameDate = getInitialDate(year, month, date);
const periodInDays = 1;

const getToday = () => getISTDate(new Date().getTime());

const getLastGameDate = (today) => {
    const t = getInitialDate(...parseDate(today));
    let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
    return addDays(t, -daysSinceLastGame)
}

const getNextGameDate = (today) => {
    return addDays(getLastGameDate(today), periodInDays)
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
    const [year, month, date] = parseDate(getToday());
    return `${date}-${month}-${year}`;
}

module.exports = {
    getSolution,
    getToday,
    getFormattedToday
}
