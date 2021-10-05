console.log('Loading function');

var zlib = require('zlib');
var https = require('https');
var querystring = require('querystring');

const http = require('https')

function postToTrello(subject, message, context) {
     return new Promise((resolve, reject) => {
         
        let trelloApiKey = process.env.trelloApiKey
        let trelloToken = process.env.trelloToken
        let trelloListId = process.env.trelloListId
        
        var body='';
        var payloadStr = {
            "idList": trelloListId,
            "name": subject,
            "desc": message,
            "due": null,
            "urlSource": null
         };
         
        var postData = querystring.stringify(payloadStr);
        console.info(postData);
    
        const options = {
            host: 'api.trello.com',
            path: '/1/cards?' + 'key=' + trelloApiKey + '&token=' + trelloToken + '&' + postData,
            port: 443,
            method: 'POST'
        };
        
        var postReq = https.request(options, function(res) {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', function (chunk) {
              body += chunk;
            });
            
            context.succeed('DONE');
            return res;
        });
    
        postReq.on('error', error => {
            console.error(error)
        })

        postReq.write(postData);
        postReq.end();
    });
}

exports.handler = async (event, context) => {
    const subject = event.Records[0].Sns.Subject;
    const timestamp = event.Records[0].Sns.Timestamp;
    
    const jsonMessage = JSON.parse(event.Records[0].Sns.Message);
    
    const state =  jsonMessage.NewStateValue;
    const alarmName = jsonMessage.AlarmName;
    const alarmDescription = jsonMessage.AlarmDescription;
    const reason = jsonMessage.NewStateReason;
    const when = jsonMessage.StateChangeTime;
    
    const message = state + "\n\n" + alarmName + "\n\n" + alarmDescription + "\n\n" + reason + "\n On " + when;
    console.info(subject);
    console.info(message);
    
    if (state != "ALARM") {
        return;
    }
    
    return postToTrello(subject, message, context).then((data) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data),
         };
        return response;
    });
};
