console.log('Loading function');

var zlib = require('zlib');
var https = require('https');
var querystring = require('querystring');

const http = require('https')

function postToTrello(subject, message, context) {
  return new Promise((resolve, reject) => {
         
    var trelloApiKey = process.env.trelloApiKey
    var trelloToken = process.env.trelloToken
    var trelloListId = process.env.trelloListId

    console.log(trelloApiKey);
    console.log(trelloToken);
    console.log(trelloListId);

    var str = '';
    var responseObj = {};
        
    var payloadStr = {
      "idList": trelloListId,
      "name": subject,
      "desc": message,
      "due": null,
      "urlSource": null
    };
         
    var postData = querystring.stringify(payloadStr);
    
    const options = {
      host: 'api.trello.com',
      path: '/1/cards?' + 'key=' + trelloApiKey + '&token=' + trelloToken + '&' + postData,
      port: 443,
      method: 'POST'
    };
        
    var postReq = https.request(options, function(res) {
            
      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function () {
        let succeed_state = 'DONE';

        console.log(str)
        console.log(res.statusCode)

        if (res.statusCode != 200) { succeed_state = 'FAILED'};
        responseObj = { statusCode: res.statusCode, body: str, state: succeed_state };
        resolve(responseObj);
      });

      context.succeed('DONE');
      return res;
    });

    postReq.on('error', error => {
      context.fail('ERROR');
      let errorObj = { state: 'ERROR', error_message: error.message };
      reject(errorObj);
    })

    postReq.end();
  });
}

exports.handler = async (event, context) => {
  const subject = event.Records[0].Sns.Subject;
    
  const jsonMessage = JSON.parse(event.Records[0].Sns.Message);
  const alarmName = jsonMessage.AlarmName;
  const alarmDescription = jsonMessage.AlarmDescription;
  const reason = jsonMessage.NewStateReason;
  const when = jsonMessage.StateChangeTime;
  const state = jsonMessage.NewStateValue;

  const response = {
    state: null,
    http_response: { statusCode: null, body: null }
  };

  if (state != "ALARM") {
    console.info("Skipping as state is " + state);
    context.succeed('SKIPPED');
    response.state = 'SKIPPED'
    return response;
  }

  const message = state + "\n\n" + alarmName + "\n\n" + alarmDescription + "\n\n" + reason + "\n On " + when;

  console.info("Posting to Trello");
  console.info(subject);
  console.info(message);
    
  return postToTrello(subject, message, context)
  .then(responseObj => { 
    response.state = responseObj.state;
    response.http_response.statusCode = responseObj.statusCode;
    response.http_response.body = responseObj.body;
    return response;
  })
  .catch(errorObj => {
    console.log(errorObj.error_message);
    response.state = errorObj.state;
    response.error_message = errorObj.error_message;
    return response;
  })
};
