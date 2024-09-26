const LambdaTester = require('lambda-tester');
const {createDynamoDocumentClientMock} = require("./ddbMock");
const {mockForexLoginAPI, mockForexGetDataAPI} = require("./restMock");
const myHandler = require('../src/app.js').handler;

describe("Status Report Lambda", () => {

    beforeEach(async function () {
    });

    afterEach(async function () {
    });

    test('Receives success message and fails to update ddb colum count', async () => {
        createDynamoDocumentClientMock()
        // mockForexLoginAPI()
        // mockForexGetDataAPI()
        return await LambdaTester(myHandler).event({symbol: "AUD/USD", numberQuotes : 400, endTime: "09/09/2024", tIncrement: 0.005, minutesInterval: 10})
            .expectResult((result) => {
                console.log(result)
            });
    });
});
