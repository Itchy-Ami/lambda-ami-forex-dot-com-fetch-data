const tokenData = {
    token: undefined,
};

function setToken(token) {
    tokenData.token = token;
}

function getToken() {
    return tokenData.token;
}

module.exports = {
    setToken: setToken,
    getToken: getToken,
};