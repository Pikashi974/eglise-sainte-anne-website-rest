const axios = require('axios');

var data = JSON.stringify({
    "collection": "horaires",
    "database": "eglise-sainte-anne",
    "dataSource": "Cluster0",
    "filter": {

     }
});

var config = {
    method: 'post',
    url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-ntdmg/endpoint/data/v1/action/find',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '0eqN98BmppMRT6DCJodDIrGkOVAVIPhOTKQWInikin6Ao44vX6lqsMRrHspuDtKH',
    },
    data: data
};

async function printValue() {
    await axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });

}