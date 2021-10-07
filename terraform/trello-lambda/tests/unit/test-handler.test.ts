import { SNSEvent } from "aws-lambda";
import { handler } from "../../src/index";

describe('Unit test for app handler', function () {

  const nock = require('nock')
  const context = require('aws-lambda-mock-context');

  var sns_event = "{\"AlarmName\":\"Test alarm name\",\"AlarmDescription\":\"Test alarm BeMyBeacon.\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Test Reason\",\"StateChangeTime\":\"2017-01-12T16:30:42.236+0000\"}";
  var card_name = 'ALARM: Example Subject';

  const event: SNSEvent = {
    "Records": [{
    "EventSource": "aws:sns",
    "EventVersion": "1.0",
    "EventSubscriptionArn": "arn:aws:sns:us-east-1:{{{accountId}}}:ExampleTopic",
    "Sns": {
      "Type": "Notification",
      "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
      "TopicArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic",
      "Subject": card_name,
      "Message": sns_event,
      }
    }]
  } as any

  beforeAll(() => {
    process.env.trelloApiKey = "testApiKey";
    process.env.trelloToken = "testToken";
    process.env.trelloListId = "testListId";
  });

  it('verifies successful response', async () => {
    const ctx = context();

    const mockedResponse = {
      id: "615db4d32c319821d743bc5a",
      checkItemStates: [],
      closed: false,
      name: card_name,
      idList: process.env.trelloListId
    };

    const scope = nock('https://api.trello.com')
      .post("/1/cards")
      .query(actualQueryObject => {
         if (
          actualQueryObject.key == process.env.trelloApiKey &&
          actualQueryObject.token == process.env.trelloToken &&
          actualQueryObject.idList == process.env.trelloListId &&
          actualQueryObject.name == card_name &&
          actualQueryObject.desc.includes('BeMyBeacon')
        ) { return true } else { return false };
      })
      .reply(200, mockedResponse)
 
    const result = await handler(event, ctx)

    console.log("------");
    console.log(result);
    expect(result.state).toEqual('DONE');
    expect(result.http_response.statusCode).toEqual(200);
    expect(result.http_response.body).toEqual(JSON.stringify(mockedResponse));
  });

  it('handles an 40X error response', async () => {
    const ctx = context();

    process.env.trelloApiKey = "badApiKey";
    event.Records[0].Sns.Subject = "bad subject";

    const mockedResponse = {
      error: "The error",
      name: card_name,
      idList: process.env.trelloListId
    };

    const scope = nock('https://api.trello.com')
      .post("/1/cards")
      .query(actualQueryObject => {
         return actualQueryObject.name == "bad subject";
      })
      .reply(401, mockedResponse)
 
    const result = await handler(event, ctx);

    expect(result.state).toEqual('FAILED');
    expect(result.http_response.statusCode).toEqual(401);
    expect(result.http_response.body).toEqual(JSON.stringify(mockedResponse));
  });

  it('handles does not post to trello if alarm state is OK', async () => {
    const ctx = context();

    event.Records[0].Sns.Message = "{\"AlarmName\":\"Test alarm name\",\"AlarmDescription\":\"Test alarm BeMyBeacon.\",\"NewStateValue\":\"OK\"}";

    const result = await handler(event, ctx);
    expect(result.state).toEqual('SKIPPED');
  });

  it('handles an awful HTTP error', async () => {
    const ctx = context();

    event.Records[0].Sns.Subject = "subject that crashes trello API"
    event.Records[0].Sns.Message = sns_event;

    const scope = nock('https://api.trello.com')
      .post("/1/cards")
      .query(actualQueryObject => {
         return actualQueryObject.name == "subject that crashes trello API";
      })
      .replyWithError('something awful happened')
    
    const result = await handler(event, ctx);

    const util = require('util')
    expect(result.state).toEqual('ERROR');
    expect(result.error_message).toEqual('something awful happened');
  });

});