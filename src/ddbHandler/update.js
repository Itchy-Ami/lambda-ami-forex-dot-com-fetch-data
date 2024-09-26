const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, BatchWriteCommand} = require("@aws-sdk/lib-dynamodb");
const {retryUntilSuccess} = require("../retryer");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "ami-forex-dot-com-data"


const putBarsInDDB = async (symbol, priceBars, targetTableName = tableName) => {
    const barsBulks = chunkArray(priceBars, 25);
    let total = 0
    let barsArrayForDDB = [];
    for (const barSingleBulk of barsBulks) {
        for (const element of barSingleBulk) {
            const params = buildPriceBarItemForDDB(symbol, element);
            barsArrayForDDB.push(params);
        }
        await pushDataToDDB(barsArrayForDDB, targetTableName)
        total += barsArrayForDDB.length
        console.log(`inserted ${barsArrayForDDB.length} rows,total ${total} rows`)
        barsArrayForDDB = [];
    }
}


async function pushDataToDDB(rangesArrayForDDB, targetTableName) {

    try {
        return await retryUntilSuccess(async () => {
            const command = new BatchWriteCommand({
                RequestItems: {
                    [targetTableName]: rangesArrayForDDB
                }
            });

            await ddbDocClient.send(command);
        });
    } catch (err) {
        console.error(`Exceeded Max Failures in DynamoDB Table: ${targetTableName}`);
        throw err;
    }
}


function buildPriceBarItemForDDB(symbol, priceBar) {
    return {
        PutRequest: {
            Item: {
                symbol: symbol,
                dateTime: convertDateToIsoString(parseDate(priceBar.BarDate)),
                Open: priceBar.Open,
                High: priceBar.High,
                Low: priceBar.Low,
                Close: priceBar.Close,
                expirationTime: calculateTTL(365)
            }
        }
    }
}

function convertDateToIsoString(milliseconds) {
    return new Date(milliseconds).toISOString(); // Convert to UTC string using toISOString()

}

function parseDate(dateString) {
    return parseInt(dateString.match(/\/Date\((\d+)\)\//)[1], 10);
}


function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

const calculateTTL = (days) => {
    const now = Math.floor(Date.now() / 1000);  // Current time in UNIX seconds
    return now + (days * 24 * 60 * 60);         // Add 30 days (in seconds)
};


module.exports = {
    putBarsInDDB: putBarsInDDB,
    parseDate:parseDate
}