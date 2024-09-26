exports.handler = async (event) => {
    const {getLatestItemInDDB} = require("./ddbHandler/get");
    const {barHistoryResponseFromForex, getMarketID} = require("./getData");
    const {forexLogin} = require("./login");
    const {putBarsInDDB, parseDate} = require("./ddbHandler/update");
    console.log(`Event: ${JSON.stringify(event)}`);
    try {
        let symbols = event.symbols || ["AUD/USD", "NZD/CAD"];
        await forexLogin();
        for (const symbol of symbols) {
            if (getMarketID(symbol)) {
                const currentDate = new Date();
                let lastDDBDate = await new Date( (await getLatestItemInDDB(symbol))?.dateTime || new Date().setMonth(currentDate.getMonth() - 1));
                if (lastDDBDate < currentDate) {
                    while (Math.floor(lastDDBDate / 1000 / 60) < Math.floor(currentDate.getTime() / 1000 / 60)) {
                        let date = Number(lastDDBDate) ? Math.floor(lastDDBDate / 1000) : Math.floor(new Date(lastDDBDate).getTime() / 1000);
                        let forexData = await barHistoryResponseFromForex(symbol, date);
                        if (forexData.length === 0) {
                            console.log(`No data for ${symbol} on ${new Date(date).toISOString()}`);
                            break;
                        }
                        await putBarsInDDB(symbol, forexData.PriceBars);
                        lastDDBDate = parseDate(forexData.PriceBars[forexData.PriceBars.length - 1].BarDate);
                    }

                } else {
                    console.log("Data is up to date");
                }
            } else {
                console.log(`Invalid symbol: ${symbol}`);
            }
        }
        return "Data is up to date";
    } catch (e) {
        console.log(e);
        throw e;
    }
};