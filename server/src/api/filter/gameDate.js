const { auditModel } = require('./../../models/audit');

const gameDate = async (req, res) => {
    try {
        const {
            date,
            status
        } = req.body;
        let audit = await auditModel.find({
            [`history.${date}`]: { $exists: true },
            [`history.${date}.status`]: status
        }, { _id: 0, "log": 0 });
        res.json(audit);
    } catch (error) {
        console.log(error, 'gameDate');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    gameDate
}
