const { join } = require('path');
require('dotenv').config({ path: join(__dirname, './.env') });
require('./src');

const { startOfToday, startOfYesterday } = require('date-fns');

const getToday = () => startOfToday()

console.log(getToday())