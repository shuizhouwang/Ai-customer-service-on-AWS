# AI-assignment
This is the cloud computing asssignment.
AI Customer Service Assignment

Implement the five components we discussed in the lectures:
API Layer
Services: API Gateway, Lambda, Cognito, IAM
Requirements:
Create a Cognito User Pool
Create a Cognito Identity Provider for the User Pool above
Create an API Gateway API using the following Swagger specification:
https://github.com/001000001/aics-columbia/blob/master/swagger.json (Links to an external site.)Links to an external site. 

Note: You can visualize this file at http://editor.swagger.io/ (Links to an external site.)Links to an external site.. Swagger is an API documentation tool.
Implement the following APIs:
/context GET
Retrieves all the context events for a particular user
/biometrics PUT
Communicate with the biometric layer and save a new biometric photo
/biometrics/verify POST
Given an incoming image, verify that the image matches the user
Enable IAM security on the three API Gateway APIs above
Modify the Authenticated User IAM role that Cognito creates to allow the role to call the API calls above
 

Context Layer:
 

Services: Kinesis, Lambda, DynamoDB
Requirements:
Given an event sent to Kinesis, trigger a Lambda function, validate and augment the event as necessary and then store it in a DynamoDB table that hosts context
Use DynamoDB’s expiration feature to expire context events after 15 minutes.
 

Biometric Layer:
 

Services: Lambda, Rekognition, S3, DynamoDB
Requirements:
Create two Lambda functions that
Given an incoming photo, store it to a specific biometric pool of photos in S3 and store a reference to that S3 file in DynamoDB
Given an incoming photo, compare it to a specific biometric pool of photos (references stored in DynamoDB) using Rekognition and return if it is a match or not
 

Chat Layer:
 

Services: ElasticBeanstalk, Lex, Lambda, S3
Requirements:
Build on top of the sample Node.js chat server to handle back and forth chat
https://github.com/001000001/aics-columbia/tree/master/chat-server (Links to an external site.)Links to an external site.
Deploy the Node.js server to ElasticBeanstalk
Use Lex to disambiguate the user utterances
Add at least 3 intents
Use Lambda to elicit the Lex slots
Create a webhook (an endpoint) to receive sentiment analysis results and send them either in an email using SES or back through the chat to the user
At the end of a conversation store a JSON file in S3 with context surrounding the conversation (conversation id, user id etc.) and the user utterances
 

Analytics Layer:
 

Services: S3, Lambda
Requirements:
Given the JSON object stored in S3, trigger a Lambda function that iterates over the user utterances and outputs an overall sentiment for the conversation
Send the sentiment analysis back to ElasticBeanstalk to a webhook
Download the sample iOS application showcased during class and provide the required information to test your components.

 

