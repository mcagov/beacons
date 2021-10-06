import { SNSEvent } from "aws-lambda";
import { handler } from "../../src/index";

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {

        process.env.trelloApiKey = "testApiKey";
        process.env.trelloToken = "testToken";
        process.env.trelloListId = "testListId";

        const nock = require('nock')

        const sns_event = "{\"AlarmName\":\"Test alarm name\",\"AlarmDescription\":\"Test alarm BeMyBeacon.\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Test Reason\",\"StateChangeTime\":\"2017-01-12T16:30:42.236+0000\"}";
        const card_name = 'ALARM: Example Subject';

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
          .reply(200, mockedResponse,
        )

        const context = require('aws-lambda-mock-context');
        const ctx = context();

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
                "MessageAttributes": {
                    "Test": {
                        "Type": "String",
                        "Value": "TestString"
                    },
                    "TestBinary": {
                        "Type": "Binary",
                        "Value": "TestBinary"
                    }
                }
            }
          }]
        } as any
 
        const result = await handler(event, ctx)

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify(mockedResponse));
    });
});

