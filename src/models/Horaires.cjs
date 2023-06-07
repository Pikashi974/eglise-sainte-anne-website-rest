const axios = require('axios');

class Horaires {
  dbName;

  constructor(uri, dbName, api_key) {
    this.uri = uri;
    this.dbName = dbName;
    this.api_key = api_key;
  }
  /**
   * 
   * @api {POST} /this.uri+action/find Find Collection
   * @apiName #getCollection
   * 
   * 
   * @apiSuccess (200) {JSON} documents A JSON with all the elements in a collection 
   * 
   * @apiSuccessExample {JSON} Success-Response:
   * {
   * "documents": [
   *     {
   *         "_id": "1",
   *         "jour": "jour": "DIMANCHE (et SOLENNITÉS fériées)",
   *         "value": [
   *                {
   *                  "heure": "9h00",
   *                  "description": "MESSE"
   *                },
   *          ]
   *      }
   *   ]
   * }
   * 
   */
  #getCollection = async () => {
    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "horaires",
      "filter": {

      }
    });
    var config = {
      method: 'post',
      url: this.uri + 'action/find',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': this.api_key,
      },
      data: data
    };
    let res = await axios(config)
      .then(function (response) {
        return (response.data.documents);
      });
    return res;
  };

    /**
   * 
   * @apiName getHoraires
   * 
   * @apiSuccess (200) {Array} res A reorganized JSON file 
   * 
   * @apiSuccessExample {Array} Success-Response:
   * {
   *      "id": "1",
   *      "jour": "jour": "DIMANCHE (et SOLENNITÉS fériées)",
   *      "value": [
   *                {
   *                  "heure": "9h00",
   *                  "description": "MESSE"
   *                },
   *          ]
   * }
   * 
   * 
   */
  getHoraires = async () => {
    console.log(`Horaires.js > getHoraires`);

    const horaires = await this.#getCollection();

    let res = horaires.map((horaire) => {
      return {
        id: horaire._id,
        jour: horaire.jour,
        value: horaire.value,
      };
    });
    // console.log(res);
    return res;
  };

  /**
   * 
   * @api {POST} /action/insertOne Add one horaire
   * @apiName addHoraire
   * 
   * 
   * @apiParam  {Horaires} horaire 
   * 
   * @apiSuccess (200) {JSON} res description
   * 
   * @apiParamExample  {horaire} Request-Example:
   * "document": {
   *    "jour": "Sivanaday",
   *    "value": {
   *      "heure": "9h00",
   *      "description": "MESSE"
   *    }
   * }
   * 
   * 
   * @apiSuccessExample {JSON} Success-Response:
   * {
   *  "insertedId": "5"
   * }
   * 
   * 
   */
  addHoraire = async (horaire) => {
    console.log(`Horaire.js > addHoraire: ${horaire}`);

    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "horaires",
      "document": {
        "jour": horaire.jour,
        "value": horaire.value,
      }
    });
    var config = {
      method: 'post',
      url: this.uri + 'action/insertOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': this.api_key,
      },
      data: data
    };
    let res = await axios(config)
      .then(function (response) {
        return (response.data);
      });
    return res;
  };

    /**
   * 
   * @api {POST} /action/updateOne Update one horaire
   * @apiName updateHoraire
   * 
   * 
   * @apiParam  {String} id 
   * @apiParam  {Horaires} horaire 
   * 
   * @apiSuccess (200) {JSON} res description
   * 
   * @apiParamExample  {id} Request-Example:
   *  id = "5"
   * "document": {
   *    "jour": "Sivanaday",
   *    "value": {
   *      "heure": "9h00",
   *      "description": "MESSE"
   *    }
   * }
   * 
   * 
   * @apiSuccessExample {JSON} Success-Response:
   * {    
   *  "matchedCount": 1,
   *  "modifiedCount": 1
   * }
   * 
   * 
   */
  updateHoraire = async (id, horaire) => {
    console.log(`Horaire.js > updateHoraire: ${horaire}`);

    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "horaires",
      "filter": { "_id": {
          "$oid": id
      }},
      "update": { 
          "jour": horaire.jour,
          "value": horaire.value
        }
    });
    var config = {
      method: 'post',
      url: this.uri + 'action/updateOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': this.api_key,
      },
      data: data
    };
    let res = await axios(config)
      .then(function (response) {
        return (response.data);
      });
    return res;
  };
  /**
   * 
   * @api {POST} /action/deleteOne Delete one horaire
   * @apiName deleteHoraire
   * 
   * 
   * @apiParam  {String} id 
   * 
   * @apiSuccess (200) {JSON} res description
   * 
   * @apiParamExample  {type} Request-Example:
   * id=5
   * 
   * 
   * @apiSuccessExample {JSON} Success-Response:
   * {    
   *  "deletedCount": 1
   * }
   * 
   * 
   */
  deleteHoraire = async (id) => {
    console.log(`Horaire.js > deleteHoraire: ${id}`);
    
    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "horaires",
      "filter": { "_id": {
          "$oid": id
      }}
    });
    var config = {
      method: 'post',
      url: this.uri + 'action/deleteOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': this.api_key,
      },
      data: data
    };
    let res = await axios(config)
      .then(function (response) {
        return (response.data);
      });
    return res;
  };
}

module.exports = Horaires;
