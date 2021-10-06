import { SNSEvent } from "aws-lambda";
import { handler } from "../../src/index";

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {

        const nock = require('nock')

        const mockedResponse = {
          license: {
            key: 'mit',
            name: 'MIT License',
            spdx_id: 'MIT',
            url: 'https://api.github.com/licenses/mit',
            node_id: 'MDc6TGljZW5zZTEz',
          }
        };

        const scope = nock('https://api.trello.com')
          .post(/.*cards.*$/)
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
                "Subject": "ALARM: Example Subject",
                "Message": "{\"AlarmName\":\"Test alarm name\",\"AlarmDescription\":\"Test alarm description.\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Test Reason\",\"StateChangeTime\":\"2017-01-12T16:30:42.236+0000\"}",
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
        console.log(result);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify(mockedResponse));
    });
});

