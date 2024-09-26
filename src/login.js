const {setToken} = require("./tokenStore");
const axios = require('axios');

async function forexLogin() {
    const ForexDotComAPIURL = "https://ciapi.cityindex.com/tradingapi/";
    const ForexDotComAPIUser = "DM383696";
    const ForexDotComAPIPassword = "Forex1234";

    const url = `${ForexDotComAPIURL}session`;
    const data = JSON.stringify({
        Username: ForexDotComAPIUser,
        Password: ForexDotComAPIPassword
    });

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Logged into Forex');
            setToken(response.data.Session);
        } else {
            console.error('Error logging into Forex.com');
            throw new Error('failed to get token from forex.com');
        }
    } catch (error) {
        console.error('Error logging into Forex.com');
        console.error(error.message);
        throw error;
    }
}

module.exports = {forexLogin: forexLogin};

