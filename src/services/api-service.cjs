const axios = require('axios');
const authService = require('./auth-service.cjs');

/**
 * 
 * @api {GET} /private Get Private Data
 * @apiName getPrivateData
 * 
 * 
 * @apiSuccess (200) {String} result.data Data from the private
 * 
 * 
 * 
 */
async function getPrivateData() {
  const result = await axios.get('http://localhost:3000/private', {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
    },
  });
  return result.data;
}

module.exports = {
  getPrivateData,
}