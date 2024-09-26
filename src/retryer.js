
async function retryUntilSuccess(apiRequest) {
    const MAX_RETRIES = 3;
    let countAttempts = 0;
    let errorResponse;
    while (countAttempts < MAX_RETRIES) {
        try {
            return await apiRequest();
        } catch (e) {
            countAttempts++;
            const logMessage = countAttempts < MAX_RETRIES ? 'Retrying request again' : 'All attempts failed';
            console.info(logMessage, e);
            errorResponse = e;
            await sleep(1000)

        }
    }
    console.error(errorResponse);
    throw new Error(errorResponse);
}

const sleep = (ms) => {
    console.log(`going to sleep for ${ms}`)
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    retryUntilSuccess: retryUntilSuccess,
    sleep: sleep
};