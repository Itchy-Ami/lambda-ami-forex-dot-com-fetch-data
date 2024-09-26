const { DynamoDBDocumentClient, QueryCommand , TransactWriteCommand} = require("@aws-sdk/lib-dynamodb");
const { mockClient } = require("aws-sdk-client-mock");

const dynamoMock = mockClient(DynamoDBDocumentClient);

function createDynamoDocumentClientMock() {
    dynamoMock.on(TransactWriteCommand).resolves({});
    dynamoMock.on(QueryCommand).resolves({Items: [{
            Close: 0.681915,
            Low: 0.681865,
            High: 0.68202,
            dateTime: '2024-09-19T16:57:00.000Z',
            symbol: 'AUD/USD',
            Open: 0.68202,
            expirationTime: 1758301083
        }]});
}


module.exports = {
    createDynamoDocumentClientMock: createDynamoDocumentClientMock
}