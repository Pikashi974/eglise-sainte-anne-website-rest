const jwtDecode = require('jwt-decode');
const axios = require('axios');
const url = require('url');
const envVariables = require('../../env-variables');
const keytar = require('keytar');
const os = require('os');

const { apiIdentifier, auth0Domain, clientId } = envVariables;

const redirectUri = 'http://localhost/callback';

const keytarService = 'electron-openid-oauth';
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;
let refreshToken = null;

/**
 * 
 * @apiName getAccessToken
 * 
 * @apiSuccess (200) {JSON} accessToken The access token
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *  "iss": "https://my-domain.auth0.com/",
 * "sub": "auth0|123456",
 * "aud": [
 *  "https://example.com/health-api",
 *  "https://my-domain.auth0.com/userinfo"
 * ],
 * "azp": "my_client_id",
 * "exp": 1311281970,
 * "iat": 1311280970,
 * "scope": "openid profile read:patients read:admin"
 * }
 * 
 * 
 */
function getAccessToken() {
    return accessToken;
}

/**
 * 
 * @apiName getProfile
 * 
* @apiSuccess (200) {JSON} Profile The user profile
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *  "iss": "https://my-domain.auth0.com/",
 * "sub": "auth0|123456",
 * "aud": [
 *  "https://example.com/health-api",
 *  "https://my-domain.auth0.com/userinfo"
 * ],
 * "azp": "my_client_id",
 * "exp": 1311281970,
 * "iat": 1311280970,
 * "scope": "openid profile read:patients read:admin"
 * }
 * 
 * 
 */
function getProfile() {
    return profile;
}

/**
 * 
 * @apiName getAuthenticationURL
 * 
 * @apiSuccess (200) {String} URL The authentification URL
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * "https://auth0Domain/authorize?scope=openid%20profile%20offline_access&response_type=code&client_id=clientId&redirect_uri=redirectUri"
 * 
 * 
 */
function getAuthenticationURL() {
    return (
        "https://" +
        auth0Domain +
        "/authorize?" +
        "scope=openid profile offline_access&" +
        "response_type=code&" +
        "client_id=" +
        clientId +
        "&" +
        "redirect_uri=" +
        redirectUri
    );
}

/**
 * 
 * @api {POST} /oauth/token Refreshing a Token
 * @apiName refreshTokens
 * 
 */
async function refreshTokens() {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (refreshToken) {
        const refreshOptions = {
            method: 'POST',
            url: `https://${auth0Domain}/oauth/token`,
            headers: { 'content-type': 'application/json' },
            data: {
                grant_type: 'refresh_token',
                client_id: clientId,
                refresh_token: refreshToken,
            }
        };

        try {
            const response = await axios(refreshOptions);

            accessToken = response.data.access_token;
            profile = jwtDecode(response.data.id_token);
        } catch (error) {
            await logout();

            throw error;
        }
    } else {
        throw new Error("No available refresh token.");
    }
}

/**
 * 
 * @api {POST} /oauth/token Loading tokens
 * @apiName loadTokens
 * 
 * 
 * @apiParam  {String} callbackURL URL to use as callback
 * 
 * @apiParamExample  {String} Request-Example:
 * http://localhost/callback*
 * 
 * 
 */
async function loadTokens(callbackURL) {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
        'grant_type': 'authorization_code',
        'client_id': clientId,
        'code': query.code,
        'redirect_uri': redirectUri,
    };

    const options = {
        method: 'POST',
        url: `https://${auth0Domain}/oauth/token`,
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(exchangeOptions),
    };

    try {
        const response = await axios(options);

        accessToken = response.data.access_token;
        profile = jwtDecode(response.data.id_token);
        refreshToken = response.data.refresh_token;

        if (refreshToken) {
            await keytar.setPassword(keytarService, keytarAccount, refreshToken);
        }
    } catch (error) {
        await logout();

        throw error;
    }
}

/**
 * @apiName logout
 * 
 * @apiDescription Logs out of the app
 */
async function logout() {
    await keytar.deletePassword(keytarService, keytarAccount);
    accessToken = null;
    profile = null;
    refreshToken = null;
}

/**
 * @apiName getLogOutUrl
 * 
 * @apiSuccess (200) {String} URL The URL Logout
 * 
 * @apiSuccessExample {type} Success-Response:
 * `https://auth0Domain/v2/logout`
 * 
 * 
 */
function getLogOutUrl() {
    return `https://${auth0Domain}/v2/logout`;
}

module.exports = {
    getAccessToken,
    getAuthenticationURL,
    getLogOutUrl,
    getProfile,
    loadTokens,
    logout,
    refreshTokens,
};