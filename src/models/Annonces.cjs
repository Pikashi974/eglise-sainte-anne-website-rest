const axios = require('axios');

class Annonces {
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
   * @apiSuccess (200) {JSON} res A JSON with all the elements in a collection
   * 
   * @apiSuccessExample {JSON} Success-Response:
   * {
   * "documents": [
   *     {
   *         "_id": "1",
   *         "annonces": [
   *            "Texte 1",
   *           "Texte 2"
   *          ]
   *      }
   *   ]
   * }
   * 
   * 
   */
  #getCollection = async () => {
    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "annonces",
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
   * @apiName getAnnonces
   * 
   * @apiSuccess (200) {Array} res A reorganized JSON file 
   * 
   * @apiSuccessExample {Array} Success-Response:
   * {
   *      "id": "1",
   *      "annonces": [
   *            "Texte 1",
   *            "Texte 2"
   *          ]
   * }
   * 
   * 
   */
  getAnnonces = async () => {
    console.log(`Annonces.js > getAnnonces`);

    const annonces = await this.#getCollection();

    let res = annonces.map((annonce) => {
      return {
        id: annonce._id,
        annonces: annonce.annonces
      };
    });
    console.log(res);
    return res;
  };
  /**
   * 
   * @api {POST} /action/insertOne Add one annonce
   * @apiName addAnnonce
   * 
   * 
   * @apiParam  {Annonces} annonce 
   * 
   * @apiSuccess (200) {JSON} res description
   * 
   * @apiParamExample  {type} Request-Example:
   * "document": {
   *    "annonces": [
   *            "Texte 1",
   *            "Texte 2"
   *     ]
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
  addAnnonce = async (annonce) => {
    console.log(`Annonce.js > addAnnonce: ${annonce}`);

    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "annonces",
      "document": {
        "annonces": annonce.annonces,
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
   * @api {POST} /action/updateOne Update one annonce
   * @apiName updateAnnonce
   * 
   * 
   * @apiParam  {String} id 
   * @apiParam  {Annonces} annonce 
   * 
   * @apiSuccess (200) {JSON} res description
   * 
   * @apiParamExample  {id} Request-Example:
   *  "id" = "5"
   * "document": {
   *    "annonces": [
   *            "Texte 1",
   *            "Texte 2"
   *     ]
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
  updateAnnonce = async (id, annonce) => {
    console.log(`Annonce.js > updateAnnonce: ${annonce}`);

    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "annonces",
      "filter": {
        "_id": {
          "$oid": id
        }
      },
      "update": {
        "annonces": annonce.annonces
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
   * @api {POST} /action/deleteOne Delete one annonce
   * @apiName deleteAnnonce
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
  deleteAnnonce = async (id) => {
    console.log(`Annonce.js > deleteAnnonce: ${id}`);

    var data = JSON.stringify({
      "dataSource": "Cluster0",
      "database": this.dbName,
      "collection": "annonces",
      "filter": {
        "_id": {
          "$oid": id
        }
      }
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

module.exports = Annonces;
