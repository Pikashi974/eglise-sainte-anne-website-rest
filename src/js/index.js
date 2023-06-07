// const horaireview = require("../view/HoraireView")

const navbar = document.querySelector(".sb-topnav");
const sidenav = document.querySelector("#layoutSidenav_nav");
const datatables = document.querySelector('#dataNews');

window.addEventListener("load", async () => {
    //Callback
    window.api.gotHoraires(gotHoraires);
    init();
});

let horaireData = {};

/**
 * 
 * @apiName init
 * 
 * @apiDescription Initialize the different elements of the page
 * 
 * 
 */
async function init() {
    window.api.initNavbar();
    window.api.initSidenav();
    window.api.initFooter();

    console.log("Elements initialisés");
}
/**
 * @apiName gotHoraires

 * 
 * @apiParam  {Array[Horaire]} horaires All the horaires
 * 
 * @apiParamExample  {type} Request-Example:
 *  id = "5"
 * "document": {
 *      "jour": "Sivanaday",
 *      "value": {
 *          "heure": "9h00",
 *          "description": "MESSE"
 *      }
 *  }
 * 
 * 
 * 
 */
const gotHoraires = (horaires) => {
    horaireData = horaires;
    var empData = horaires.map((horaire) => {
        var res = `<tr>
                    <td>${horaire.jour}</td>
                    <td> ${valuesDisplay(horaire.value)}</td>
                   </tr>`;

        return res;
    })
        .join("");
    var tbData = document.getElementById("horaires");
    tbData.innerHTML = empData;
    
    var tabData = document.getElementById("dataHoraire");
    tabData.innerHTML = empData;
    
    createDatatable(datatables);
};


function createDatatable(id) {
    if (id) {
        new simpleDatatables.DataTable(id);
    }
  }

const valuesDisplay = (values) => {
    let text = "";
    if (values.length == null) {
        text += values.heure + ": " + values.description + "<br>"
    } else {
        values.forEach(element => {
            text += element.heure + ": " + element.description + "<br>"
        });
    }
    return text;
}
