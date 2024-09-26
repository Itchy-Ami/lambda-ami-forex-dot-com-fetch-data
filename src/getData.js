const axios = require("axios");
const {getToken} = require("./tokenStore");
const marketIdMap = require('./symbolToMarketID.json');

function getMarketID(symbol) {
    console.log(`fetching market id for ${symbol}`);
    return marketIdMap[symbol.toUpperCase()];
}

async function barHistoryResponseFromForex(symbol, endTime) {
    const ForexDotComAPIURL = "https://ciapi.cityindex.com/tradingapi/";
    const ForexDotComAPIUser = "DM383696";

    const url = `${ForexDotComAPIURL}market/${getMarketID(symbol)}/barhistoryafter?Username=${ForexDotComAPIUser}&session=${getToken()}&interval=MINUTE&span=1&fromTimestampUTC=${endTime}&priceType=MID&maxResults=4000`;

    try {
        const response = await axios.get(url);
        if (response.data.PartialPriceBar !== null){
            response.data.PriceBars.push(response.data.PartialPriceBar)
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching bar history from Forex.com');
        console.error(error.message);
        return null;
    }
}

module.exports = {
    barHistoryResponseFromForex: barHistoryResponseFromForex,
    getMarketID: getMarketID
};
