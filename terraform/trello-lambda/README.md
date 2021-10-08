# Trello Lambda
  
An AWS lambda function that posts SNS events from CloudWatch onto your Trello board.

This little project contains the javascript which runs on Node.js within the lambda (src/index.js).

You can run unit tests and develop the lambda locally without hitting AWS or Trello. 
## Required Setup

To test:

```sh
  npm install
  npm run test
```

## Deployment via Terraform

Build the Zip which will be deployed to AWS.

```sh
  cd  src
  zip trello-lambda.zip index.js 
```

Go Back and setup/run Terraform.

```sh
  cd ../
```

Setup your API keys and tokens for trello by adding them to dev.tfvars e.g:

```sh
  trello_api_key = "2bf7.........."
  trello_token  = "d20cded595cd........"
  trello_list_id = "615706....."
```

You can get your token and keys from trello by following instructions on:

  https://trello.com/app-key

and then discover the unique id of the column within the baord you would like to create cards by:

  https://api.trello.com/1/boards/your-id/lists?key=your-key&token=your-token

You can now run Terraform from the console, as you are only deploying the lambda you can leave all the values it prompts for blank.

```sh
  terraform init
  terraform workspace dev
  terraform apply -var-file=dev.tfvars  -target=aws_lambda_function.notify_trello_lambda
  terraform apply -var-file=dev.tfvars  -target=aws_sns_topic_subscription.sns_technical_alerts_lambda_subscription
  terraform apply -var-file=dev.tfvars  -target=aws_lambda_permission.with_sns_technical_alerts
  terraform apply -var-file=dev.tfvars  -target=aws_sns_topic_subscription.sns_service_alerts_lambda_subscription
  terraform apply -var-file=dev.tfvars  -target=aws_lambda_permission.with_sns_service_alerts
```

## Live Testing

Browse to the lambda function in the AWS Console.

To aid testing you can use this handy JSON:

```sh
  trello-test-data.json 
```

Add it as test data in the AWS lambda console.

Once you run the test it will post to trello using the API keys and List Id as the destination board/column.
