const passport = require('passport');

const login = async (req, res) => {
    try {
        passport.authenticate('basic', (err, user) => {
            if (err) {
                if (err === 'INP' || err === 'UNF') {
                    res.send(err);
                } else {
                    res.status(400).send(err.message || err);
                }
            } else {
                req.login(user, (err) => {
                    if (err) {
                        res.status(400).send(err.message || err);
                    } else {
                        res.send(true);

                    }
                });
            }
        })(req, res);
    } catch (error) {
        console.log(error, 'create');
        const errorMsg = error.message ? error.message : error;
        res.status(400).send(errorMsg);
    }
}

module.exports = {
    login
}
