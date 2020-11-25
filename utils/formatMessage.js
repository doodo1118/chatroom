const moment = require('moment');

function formatMessage(sender, message){
    return {
        sender, 
        message, 
        time: moment().format('h:mm a'), 
    }
}

module.exports = formatMessage;