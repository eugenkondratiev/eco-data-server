const fs = require('fs');
const LOG_PATH = 'D:\\js\\Logs\\'

module.exports = function(message) {
    console.log(message);
    const dt= new Date();
    const logName = LOG_PATH + (new Date()).toDateString;
    const msg = dt.toString() + message + "\n"
    fs.appendFile(logName, msg, (err) => {
        if (err) {
            ;
        } else {
            ;
        }
    });
}