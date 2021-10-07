console.log('Loading function');

var zlib = require('zlib');
var https = require('https');
var querystring = require('querystring');
var http = require('https')

var success_state = 'DONE'
var failed_state = 'FAILED'
var error_state = 'ERROR'
var skipped_state = 'SKIPPED'

function postToTrello(subject, message, context) {
  return new Promise((resolve, reject) => {

         
    var trelloApiKey = process.env.trelloApiKey
    var trelloToken = process.env.trelloToken
    var trelloListId = process.env.trelloListId

    var response_body = "";
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
      let succeed_state = null;

      res.on('data', function(chunk) {
        response_body += chunk;
      });

      res.on('end', function () {
        responseObj = { statusCode: res.statusCode, body: response_body };
        resolve(responseObj);
      });

      if (res.statusCode != 200) { succeed_state = failed_state } else { succeed_state = success_state };

      context.succeed(succeed_state);
      return res;
    });

    postReq.on('error', error => {
      context.fail(error_state);
      let errorObj = { error_message: error.message };
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
  const alarm_state = jsonMessage.NewStateValue;

  const response = {
    http_response: { statusCode: null, body: null }
  };

  if (alarm_state != "ALARM") {
    console.info("Skipping as state is %s", alarm_state);
    context.succeed(skipped_state);
    return response;
  }

  const message = alarm_state + "\n\n" + alarmName + "\n\n" + alarmDescription + "\n\n" + reason + "\n On " + when;

  console.info("Posting to Trello");
  console.info(subject);
  console.info(message);
    
  return postToTrello(subject, message, context)
  .then(responseObj => { 
    console.info('API return code: %s', responseObj.statusCode);
    response.http_response.statusCode = responseObj.statusCode;
    response.http_response.body = responseObj.body;
    return response;
  })
  .catch(errorObj => {
    console.log(errorObj.error_message);
    response.error_message = errorObj.error_message;
    return response;
  })
};
