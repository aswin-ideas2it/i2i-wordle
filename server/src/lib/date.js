const getFormattedDate = (gameDate) => {
    gameDate = new Date(gameDate);
    return `${gameDate.getDate()}-${gameDate.getMonth() + 1}-${gameDate.getFullYear()}`;
}

module.exports = {
    getFormattedDate
}
