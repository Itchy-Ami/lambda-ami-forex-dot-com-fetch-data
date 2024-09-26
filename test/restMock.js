const nock = require('nock');
const responseData = require('./getDataResponse.json');

function mockForexLoginAPI() {

    nock('https://ciapi.cityindex.com')
        .post('/tradingapi/session', "{\"Username\":\"DM383696\",\"Password\":\"Forex1234\"}")
        .times(4)
        .reply(200, {
            "Session": "f7a632cb-efb8-41c2-aabd-273c03fca90a",
            "PasswordChangeRequired": false,
            "AllowedAccountOperator": false,
            "StatusCode": 1,
            "AdditionalInfo": null,
            "Is2FAEnabled": false,
            "TwoFAToken": null,
            "Additional2FAMethods": null,
            "UserType": 1
        });
}

function mockForexGetDataAPI(errors, metadata) {

    nock('https://ciapi.cityindex.com')
        .get('/tradingapi/market/401484317/barhistory?Username=DM383696&session=f7a632cb-efb8-41c2-aabd-273c03fca90a&interval=MINUTE&span=1&fromTimestampUTC=08/07/2024&pricetype=MID&PriceBars=4000')
        .reply(200, responseData);
}

module.exports = {
    mockForexLoginAPI: mockForexLoginAPI,
    mockForexGetDataAPI: mockForexGetDataAPI
}