const { auditModel } = require('./../../models/audit');

const gameDate = async (req, res) => {
    try {
        const {
            date,
            status,
            showMinimimalData = false
        } = req.body;

        const presentation = showMinimimalData ? { history: 0, isLocalUser: 0 } : {};
        let audit = await auditModel.find({
            [`history.${date}`]: { $exists: true },
            [`history.${date}.status`]: { $in: status instanceof Array ? status : [status] }
        }, { ...{ _id: 0, "log": 0 }, ...presentation });
        res.json({ count: audit.length, audit });

    } catch (error) {
        console.log(error, 'gameDate');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    gameDate
}
