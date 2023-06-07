// const horaireview = require("../view/HoraireView")

const navbar = document.querySelector(".sb-topnav");
const sidenav = document.querySelector("#layoutSidenav_nav");
const datatables = document.querySelector('#dataNews');
const button = document.querySelector("#buttonChange");

window.addEventListener("load", async () => {
    //Callback
    window.api.gotHoraires(gotHoraires);
    window.api.gotAnnonces(gotAnnonces);
    init();
});

let horaireData, annonceData = {};

/**
 * 
 * @apiName init
 * 
 * @apiDescription Initialize the different elements of the page
 * 
 * 
 */
async function init() {
    button.addEventListener("click", showXML)
    window.api.initNavbar();
    window.api.initSidenav();
    window.api.initFooter();
    window.api.getAnnonces();

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
    }).join("");
    var tbData = document.getElementById("horaires");
    tbData.innerHTML = empData;
};

const gotAnnonces = (annonces) => {
    annonceData = annonces;
    var empData = annonces.map((annonce) => {
        var res = "";
        button.value = annonce.id;
        for (let index = 0; index < annonce.annonces.length; index++) {
            res += `<p>${annonce.annonces[index].replace(/\n/g, "<br>")}</p>`;
        }
        return res;
    }).join("");
    var tbData = document.getElementById("textJSON");
    tbData.innerHTML = empData;
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

const showXML = () => {
    let output = document.querySelector("#textJSON");
    console.log("Showtime");
    if (document.getElementById("change").value != '') {
        var input = document.getElementById("change").files[0];
        input = fetch(input.path)
            .then(response => response.text())
            .then(text => {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(text, "text/xml");
                // var annonce = window.api.XMLToJSON(text);
                output.innerHTML = xmlDoc.getElementsByTagName("lyrics")[0].innerHTML.replace(/verse/g, "p");
                // output.innerHTML = annonce;
                var lines = document.getElementsByTagName("lines")
                var annonce = new Array(lines.length);
                for (let index = 0; index < lines.length; index++) {
                    annonce[index] = (lines[index].innerText);
                }
                console.log(button.value);
                if (button.value != "") {
                    window.api.updateAnnonce(button.value, annonce);
                } else {
                    window.api.saveAnnonce(annonce);
                }
            });
    }
}
