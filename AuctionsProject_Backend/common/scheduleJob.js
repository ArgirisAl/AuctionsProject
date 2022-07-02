'use strict';
const schedule = require('node-schedule');


const job = schedule.scheduleJob('1 * * * *', function () {
    console.log('The answer to life, the universe, and everything!');
});


const validateValue = (value) => {

    const job = schedule.scheduleJob('1 * * * *', function () {
         return console.log('The answer to life, the universe, and everything!');
    });
    return job
};

module.exports = {
    job: job,
    validateValue: validateValue
}