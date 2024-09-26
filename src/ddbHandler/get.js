const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, QueryCommand} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


async function getLatestItemInDDB(symbol) {
    const params = {
        TableName:  "ami-forex-dot-com-data",
        KeyConditionExpression: `symbol = :symbol`,
        ExpressionAttributeValues: {
            ':symbol': symbol,
        },
        ScanIndexForward: false,
        Limit: 1
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        console.log("Latest item:", data.Items[0]); // Output the latest item
        return data.Items[0];
    } catch (err) {
        console.error("Error fetching the latest item:", err);
    }
}

module.exports = {
    getLatestItemInDDB: getLatestItemInDDB,
}