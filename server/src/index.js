const app = require('express')();
const cors = require('cors');
const router = require('./router');
const requestIp = require('request-ip');
const { connectMongo } = require('./../src/lib/db');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

connectMongo().then(() => {
    console.log(`Connected to Mongo DB`);
}).catch(err => {
    console.log(err, 'MongoDB connection error');
});

app.use(requestIp.mw());
app.use(useragent.express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

app.listen(PORT, console.log(`
------------------------------------------------
Ideas2IT Wordly Server is Listening at ${PORT}
------------------------------------------------`));